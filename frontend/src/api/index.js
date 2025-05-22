import { authService } from "./services/auth"
import { userService } from "./services/users"
import { productService } from "./services/products"
import { categoryService } from "./services/categories"
import { orderService } from "./services/orders"
import { supportService } from "./services/support"

export const api = {
  auth: authService,
  users: userService,
  products: productService,
  categories: categoryService,
  orders: orderService,
  support: supportService,
}

export default api
