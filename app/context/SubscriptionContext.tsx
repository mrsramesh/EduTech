import React, { createContext, useContext, useState } from 'react';

type SubscriptionContextType = {
  purchasedCourses: string[];
  refreshPurchased: () => void;
};


const SubscriptionContext = createContext<SubscriptionContextType>({
  purchasedCourses: [],
  refreshPurchased: () => {},
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  
  const refreshPurchased = async () => {
    // Implement logic to refresh purchased courses from API
  };

  return (
    <SubscriptionContext.Provider value={{ purchasedCourses, refreshPurchased }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;