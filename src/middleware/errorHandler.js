export default function errorHandler(err, req, res, next) {
  res.end(res.sentry + '\n');
  // res.status(500).send({
  //   message: "Something goes wrong!",
  // });
}
