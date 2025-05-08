import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';
import { AUTH_URL } from '@/constants/urls';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store'; // adjust path
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/utils/types';

const PaymentScreen: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { courseId } = useLocalSearchParams();
  const [checkoutHtml, setCheckoutHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const [storeToken, setStoreToken]=useState("");
  const courseIdStr = Array.isArray(courseId) ? courseId[0] : courseId;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'User not authenticated');
          return;
        }
        console.log("course id in payment screen "+courseIdStr);
        console.log("token in payment screen "+token);
        console.log("userid in payment screen "+userId);

        const { data } = await axios.post(
          AUTH_URL.PAYMENT,
          {
            courseId: courseIdStr,
            userId: userId
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        


        const options = {
          key: 'rzp_test_Kf8fzScnGfUBMN',
          amount: data.amount,
          currency: data.currency,
          name: 'EduApp',
          description: 'Course Purchase',
          order_id: data.id,
          prefill: {
            name: `${user?.fname} ${user?.lname}`,
            email: user?.email,
            contact: '9999999999'
          },
          theme: { color: '#7F56D9' },
          notes: {
            courseId:courseIdStr,
            userId: userId
          }
        };

        const htmlContent = `
          <html>
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
            </head>
            <body>
              <script>
                document.addEventListener("DOMContentLoaded", function() {
                  var options = ${JSON.stringify(options)};
                  options.handler = function (response) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(response));
                  };
                  var rzp = new Razorpay(options);
                  rzp.open();
                });
              </script>
            </body>
          </html>
        `;

        setCheckoutHtml(htmlContent);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        Alert.alert('Error', 'Failed to initialize payment');
        console.error('Order fetch failed', err);
      }
    };

    fetchOrder();
  }, [courseId, user]);

  const handlePaymentResponse = async (event: any) => {
    try {
      const response = JSON.parse(event.nativeEvent.data);
      const token = await AsyncStorage.getItem('token');
  
      const verification = await axios.post(
        AUTH_URL.VERIFY_PAYMENT,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          courseId: courseIdStr,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (verification.data.success && user && user._id && user.fname && user.lname && user.email && user.role) {
        const updatedUser: User = {
          _id: user._id,
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          token: user.token,
          purchasedCourses: [...(user.purchasedCourses || []), courseIdStr]
        };
  
        updateUser(updatedUser);
        Alert.alert('Success', 'Course purchased successfully!');
        router.back();
      } else {
        Alert.alert('Error', 'User information is incomplete or payment verification failed.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Payment verification failed');
    }
  };
  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#7F56D9" />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: checkoutHtml }}
      javaScriptEnabled
      domStorageEnabled
      onMessage={handlePaymentResponse}
      onError={() => Alert.alert('Error', 'Failed to load payment gateway')}
      style={{ flex: 1 }}
    />
  );
};

export default PaymentScreen;