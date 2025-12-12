import Contentstack from 'contentstack';

const Stack = Contentstack.Stack({
  api_key: import.meta.env.VITE_CONTENTSTACK_API_KEY,
  delivery_token: import.meta.env.VITE_CONTENTSTACK_DELIVERY_TOKEN,
  environment: import.meta.env.VITE_CONTENTSTACK_ENVIRONMENT,
});

const apiUrl = import.meta.env.VITE_CONTENTSTACK_API_HOST;

const cdnUrl = apiUrl.replace('api', 'cdn');
Stack.setHost(cdnUrl);

export default Stack;
