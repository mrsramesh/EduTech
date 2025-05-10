import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Alert } from "react-native";
import { WebView } from "react-native-webview";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { AUTH_URL } from "@/constants/urls";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from '@tanstack/react-query';

const PaymentScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: contextUser, updateUser, isLoading: authLoading } = useAuth();
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const { courseId } = useLocalSearchParams();

  const [checkoutHtml, setCheckoutHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);

  const user = reduxUser || contextUser;
  const courseIdStr = Array.isArray(courseId) ? courseId[0] : courseId;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!courseIdStr || !user || authLoading || isInitialized) return;

      console.log("🚀 Fetching payment order for course:", courseIdStr);
      setIsInitialized(true);

      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          Alert.alert("Error", "User not authenticated");
          router.back();
          return;
        }

        const { data } = await axios.post(
          AUTH_URL.PAYMENT,
          { courseId: courseIdStr, userId: user._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const options = {
          key: "rzp_test_Kf8fzScnGfUBMN",
          amount: data.amount,
          currency: data.currency,
          name: "EduApp",
          description: "Course Purchase",
          order_id: data.id,
          prefill: {
            name: `${user.fname} ${user.lname}`,
            email: user.email,
            contact: "9999999999",
          },
          theme: { color: "#7F56D9" },
          notes: { courseId: courseIdStr, userId: user._id },
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
      } catch (err) {
        const error = err as AxiosError;
        console.error("❌ Failed to fetch order:", error.response?.data || error.message);
        Alert.alert("Error", "Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [courseIdStr, user, authLoading]);

  const handlePaymentResponse = async (event: any) => {
    if (isPaymentVerified) return;
    setIsPaymentVerified(true);

    try {
      if (!user) throw new Error("User not found");

      const response = JSON.parse(event.nativeEvent.data);
      const token = await AsyncStorage.getItem("token");

      const verification = await axios.post(
        AUTH_URL.VERIFY_PAYMENT,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          courseId: courseIdStr,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (verification.data.success) {
        // await axios.post(
        //     AUTH_URL.TRANSACTION_LOG,
        //     {
        //       userId: user._id,
        //       courseId: courseIdStr,
        //       amount: verification.data.amount || data.amount, // if you return it from backend
        //       paymentId: response.razorpay_payment_id,
        //     },
        //     { headers: { Authorization: `Bearer ${token}` } }
        //   );

        const updatedUser = {
          ...user,
          purchasedCourses: [...(user.purchasedCourses || []), courseIdStr],
        };

        await updateUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: ['courses'] }); // Invalidate courses query
        Alert.alert("Success", "Course purchased successfully!");

        setTimeout(() => {
          router.replace({
            pathname: "/(course)/[id]",
            params: { id: courseIdStr },
          });
        }, 500);
      } else {
        Alert.alert("Error", "Payment verification failed");
      }
    } catch (error) {
      console.error("❌ Payment verification error:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Payment failed"
      );
    }
  };

  if (authLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#7F56D9" />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: checkoutHtml }}
      javaScriptEnabled
      domStorageEnabled
      onMessage={handlePaymentResponse}
      onError={() => Alert.alert("Error", "Failed to load payment gateway")}
      style={{ flex: 1 }}
    />
  );
};

export default PaymentScreen;