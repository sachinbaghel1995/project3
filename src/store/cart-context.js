import React, { useState, useCallback } from 'react';


const cartContext = React.createContext({
  item: [],
  quantity: 0,
  addItem: () => {},
  
});
export const CartProvider = (props) => {
  let userEmail;
  if (localStorage.getItem('tokenId')) {
    userEmail = JSON.parse(localStorage.getItem('tokenId')).email;
    // userEmail = userEmail.replace(/[@.]/g, '');
  }
  console.log(userEmail);

  const [cartState, setCartState] = useState({ item: [], totalAmount: 0 });

  
  const addItem = async (updatedCart) => {
    setCartState(updatedCart);
   try {
      const response = await fetch(
        `https://crudcrud.com/api/e913d82e24064559847b46fcd3577d2d/cartItem${userEmail}`
      );

      const data = await response.json();
      console.log('loggin called');
      if (response.ok) {
        let refreshedItem = [];
        let refreshedAmount = 0;

        data.forEach((item) => {
          refreshedItem.push(item);
          refreshedAmount += item.price * item.quantity;
        });
        
        setCartState({ item: refreshedItem, totalAmount: refreshedAmount });
      } else {
        throw data.error;
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  // logout Cart handler
 

  const contextValues = {
    item: cartState.item,
    totalAmount: cartState.totalAmount,
    addItem: addItem,
   
  };

  return (
    <cartContext.Provider value={contextValues}>
      {props.children}
    </cartContext.Provider>
  );
};
export default cartContext;
