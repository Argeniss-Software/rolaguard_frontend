# RoLaGuard Community Edition

## Frontend

This repository contains the source code of the RoLaGuard frontend. This component is the responsible of generating the graphical user interface.

To access the main project with instructions to easily run the rolaguard locally visit the [RoLaGuard](https://github.com/Argeniss-Software/rolaguard) repository. For contributions, please visit the [CONTRIBUTIONS](https://github.com/Argeniss-Software/rolaguard/blob/master/CONTRIBUTIONS.md) file

### Building the docker image

To build the docker image locally:

```bash
docker build -t rolaguard-frontend
```

### Development Enviroment
These instructions are meant to set up a local development environment for the frontend, using the backend running in the `docker-compose` from [main RoLaGuard repository](https://github.com/Argeniss-Software/rolaguard).

#### Install dependencies
First, you need to have node.js installed. The first time you run the code you need to install all dependencies. This is done by running (in the frontend folder) the following command:
```bash
npm install
```

#### Point to local backend and configure reCaptcha
After that, the frontend must be configured to make the HTTP requests to the local backend running in the docker-compose. This can be done by adding the following lines in the `./public/config.js`:

```
window.RUNTIME_API_HOST= 'http://localhost:30000/api/v1.0/';
window.RUNTIME_WS_HOST= 'http://localhost:30000/';
window.RECAPTCHA_SITEKEY= RECAPTCHA_SITE_KEY;
```
You can change the API host and/or the WS host to match your configuration (in case you modified the default configs).

Where RECAPTCHA_SITE_KEY is the public key from the reCAPTCHA service. To get obtain this key, you can generate your own (for testing purposes) or you can use the testing keys [provided by google](https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do).

**Google test keys**
- Site key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
- Secret key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

NOTE: you have to configure the reCaptcha secret key as an environment variable in the [backend](https://github.com/Argeniss-Software/rolaguard/blob/master/config/backend.env).

#### Runnning the frontend
Once you installed the dependencies, pointed the frontend to the local backend and have the docker-compose up an running, you can launch the local frontend by executing the following command in the frontend folder.
```bash
npm start
```

NOTE: in development mode, the code will recompile after saving every change made in the source code.

