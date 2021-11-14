# [💻Devvy](https://devvy.netlify.app/)

<a href="https://devvy.netlify.app/" target="_blank">
  <p align="center">
    <img alt="logo" src="static/images/logo.png">
  </p>
</a>

Devvy is a place to unleash your inner nerd. Share your code snips, dev jokes (that non-devs just don't get), memes, or just talk programming!

## Team

- [Fang🦁](https://github.com/armchair-traveller)
- [Keith](https://github.com/keithfrazier98)
- [rkr](https://github.com/rkr-dev)

## Deployment

Deployment is setup for Netlify, with the Netlify adapter. Register and setup services, exposing the following respective env variables:

- [**Magic**](https://magic.link/)
- [**ImageKit.io**](https://imagekit.io/)
- [**Fauna**](https://fauna.com/)

`.env` (public keys)

- VITE_MAGIC_PUBLIC
- VITE_IMAGEKIT_PUBLIC_KEY
- VITE_IMAGEKIT_URL_END_POINT

Netlify environment variables (private keys)

- MAGIC_SECRET
- IMAGEKIT_PRIVATE_KEY
- FAUNA_SERVER
- ENCRYPTION_SECRET
  - 📝 This is a static 32 character randomized string used to de/encrypt your cookies

Then run each command block in the Fauna dashboard, located in `src/lib/gql/fauna/setup.fql`

## Developing

Install dependencies with `npm install` or `yarn install`

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

- Dev env variables are different in that they should be in the root dir `.env.local` prefixed with `VITE_` due to bugs with Kit's handling of Vite environment variables.

## Building

```bash
npm run build
```

> You can preview the built app with `npm run preview`. This should _not_ be used to serve your app in production.

- Note that you should be previewing using Netlify Dev, and using the same env variables as specified in deployment.
