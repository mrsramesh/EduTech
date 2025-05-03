import React, { createContext, useContext, useState } from 'react';

type SubscriptionContextType = {
  isSubscribed: boolean;
  setSubscribed: (status: boolean) => void;
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  setSubscribed: () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSubscribed, setSubscribed] = useState(false);

  return (
    <SubscriptionContext.Provider value={{ isSubscribed, setSubscribed }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;