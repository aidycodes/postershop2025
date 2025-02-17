import { j } from "./jstack"
import { productsRouter } from "./routers/products-router"
import { usersRouter } from "./routers/user-router"
import { GuestCartRouter } from "./routers/guest-cart-router"
import { paymentRouter } from "./routers/payment-router"
import { cartRouter } from "./routers/cart-router"

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler)

/**
 * This is the main router for your server.
 * All routers in /server/routers should be added here manually.
 */
const appRouter = j.mergeRouters(api, {
  guestCart: GuestCartRouter,
  products: productsRouter,
  users: usersRouter,
  payment: paymentRouter,
  cart: cartRouter
})

export type AppRouter = typeof appRouter

export default appRouter


