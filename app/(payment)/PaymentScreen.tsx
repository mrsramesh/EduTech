import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useSubscription } from '../context/SubscriptionContext'; // Adjust path if needed
import { router } from 'expo-router';

const PaymentScreen: React.FC = () => {
  const { setSubscribed } = useSubscription();
  const [checkoutHtml, setCheckoutHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.post('http://192.168.1.4:5001/api/payment/create-order');

        const options = {
          key: 'rzp_test_Kf8fzScnGfUBMN',
          amount: data.amount,
          currency: data.currency,
          name: 'EduApp',
          description: 'Premium Course Unlock',
          order_id: data.id,
          prefill: {
            name: 'Ajay Saini',
            email: 'ajay@example.com',
            contact: '9999999999'
          },
          theme: { color: '#3399cc' }
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
  }, []);

  const handlePaymentResponse = async (event: any) => {
    try {
      const response = JSON.parse(event.nativeEvent.data);

      const verification = await axios.post(
        'http://192.168.1.4:5001/api/payment/verify-payment',
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        }
      );

      if (verification.data.success) {
        setSubscribed(true);
        Alert.alert('Success', 'Payment verified! Enjoy premium content');
        router.replace('/home');
      } else {
        Alert.alert('Error', 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Payment verification failed');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
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
    />
  );
};

export default PaymentScreen;
