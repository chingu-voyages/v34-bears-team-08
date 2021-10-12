// export async function getSession(req, resolve) {
//   // getSession runs server side so we're safe to parse cookies with our env encryption secret.
//   // const cookies = cookie.parse(request.headers.cookie || '')
//   // const user = await getSession(cookies['session'])
//   // request.locals.user = user;
//   // request.locals.userid = user?.publicAddress;
//   // TODO: Decrypt cookies. Setting cookies is done by api/login endpoint.
//   // TODO: Need to know if session is also readable from the server
//   // The output of session will be available on both server and client load funcs.
//   // return {
//   //   userInfo,
//   //   exp,
//   //   token,
//   // }
// }
