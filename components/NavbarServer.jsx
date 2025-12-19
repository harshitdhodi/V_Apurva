import ClientNavbar from './NavbarClient';

export default function ServerNavbar({ headerData, footerData, menuItems, colorLogo, productCategories, blogCategories }) {
  // Combine data to pass to client component
  const navbarData = {
    ...headerData,
    ...footerData,
    menuItems,
    productCategories,
    colorLogo,
    blogCategories // Add this
  };

  return <ClientNavbar {...navbarData} />;
}