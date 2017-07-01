export async function catchAsync(done, fn) {
  try {await fn()} catch (e) {done(e)}
}
