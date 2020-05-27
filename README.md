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

#### Installing dependencies
In order to run the frontend in development mode, you need to have node.js installed. The first time you run the code you need to install all dependencies, this is done by running (in the root folder) the following command:
```bash
npm install
```

#### Changing the backend server
The frontend is configured to work out of the box when it is running with `docker-compose` in the [main RoLaGuard repository](https://github.com/Argeniss-Software/rolaguard). In order to make it work in development mode it must be configured to make the HTTP requests to a local backend. This can be done by adding the following lines in the `./public/config.js`:

```
window.RUNTIME_API_HOST= 'http://localhost:3000/api/v1.0/';
window.RUNTIME_WS_HOST= 'http://localhost:3000/';
window.RECAPTCHA_SITEKEY= RECAPTCHA_SITE_KEY;
```
You can change the API host and/or the WS host to match your configuration.

The site key must be the public key from the reCAPTCHA service, you can generete your own keys or (for testing purpouses) you can use the testing keys [provided by google](https://developers.google.com/recaptcha/docs/faq#id-like-to-run-automated-tests-with-recaptcha.-what-should-i-do).

**Google test keys**
- Site key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
- Secret key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

(the secret key have to be configured in the backend)

#### Runnning the frontend
Once you have installed the dependencies and have configured the backend server, you can run the development mode by runing the following command in the root folder.
```bash
npm start
```
(in development mode, the code will recompile after every change made in the source code)

