
export const usersWithRolesState = (state) => state.myStore.usersWithRoles;
export const categoriesState = (state) => state.myStore.categories;
export const invoicesState = (state) => state.myStore.invoices;
export const invoiceDetailsState = (state) => state.myStore.invoiceDetails;
export const subCategoriesState = (state) => state.myStore.subCategories;
export const urlImageUploadedState = (state) => state.myStore.urlImageUploaded;
export const productItemsState = (state) => state.myStore.productItems;
export const userLogedInState = (state) => state.myStore.userLogedIn;
export const loginStatusState = (state) => state.myStore.loginStatus;
export const productsState = (state) => state.myStore.products;
export const getProductItemByProductIdSelector = (productId) => (state) =>
  state.myStore.productItems.filter((item) => item.product.id === +productId);
export const getProductByIdSelector = (id) => (state) =>
  state.myStore.products.find((pr) => pr.id === +id);

export const brandsState = (state) => state.myStore.brands;
export const contactsState = (state) => state.myStore.contacts
