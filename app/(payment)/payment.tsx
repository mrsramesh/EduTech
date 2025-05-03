import { View, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';

export default function PaymentScreen() {
  const [orderId, setOrderId] = useState(null);

  const handlePayment = async () => {
    // 1. Create Order ID from your server
    const response = await fetch('http://localhost:5000/api/auth/pay', { method: 'POST' });
    const order = await response.json();
    setOrderId(order.id);





    // 2. Open Razorpay Checkout page
    const checkoutUrl = `https://checkout.razorpay.com/v1/checkout.js?order_id=${order.id}&key_id=YOUR_KEY_ID`;

    // WebView se payment page kholna
    WebBrowser.openBrowserAsync(`https://YOUR_DOMAIN/checkout-page?order_id=${order.id}`);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
}


// rzp_test_EvIsWr1rssQ1T3

// ebO8AGBqbMq8CUHIiwJsfFmo