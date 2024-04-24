import * as bcrypt from 'bcrypt';

export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export const fakeUUID = '31e95a5c-83e2-4da1-a45b-0f31fb7d9b4a';

export const users = async () => [
  {
    id: 'a0d1b7fd-c5d9-429f-97f4-7dbacef127d9',
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: await bcrypt.hash('!1MySecret@', 10),
    address: '123 Main Street',
    phone: 5551234,
    country: 'United States',
    city: 'New York',
    isAdmin: true,
  },
  {
    id: 'edc7ece1-82da-4fa2-90ca-32dd71c4a49e',
    name: 'Jane Doe',
    email: 'janedoe@example.com',
    password: await bcrypt.hash('!ABcdEF1', 10),
    address: '321 Secondary Avenue',
    phone: 1112345,
    country: 'United States',
    city: 'California',
    isAdmin: false,
  },
];

export const userLogin = { email: 'janedoe@example.com', password: '!ABcdEF1' };

export const adminLogin = {
  email: 'johndoe@example.com',
  password: '!1MySecret@',
};

export const createUser = {
  name: 'Agustin Bertagna',
  email: 'agustin@gmail.com',
  password: '!ABcdEF1',
  confirmPassword: '!ABcdEF1',
  address: 'Av Colon 123',
  phone: 1234567,
  country: 'Argentina',
  city: 'Cordoba',
};

export const updateUser = {
  name: 'Agus B.',
  address: 'Av 9 de Julio',
  phone: 1234567,
  city: 'Buenos Aires',
};

export const createProduct = {
  name: 'Logitech MX Keys',
  description: 'The best keyboard in the world',
  price: 100,
  stock: 12,
  imgUrl:
    'https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/product-gallery/graphite/mx-keys-s-keyboard-top-view-graphite-esp.png?v=1',
  category: 'keyboard',
};

export const updateProduct = {
  name: 'Logitech US Keys',
  description: 'The worst keyboard in the world',
  price: 1,
  stock: 1,
  imgUrl: 'nolink',
};
