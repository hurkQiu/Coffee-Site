import CoffeeBeans from '@/components/CoffeeBeans.vue'
import CoffeeUtensil from '@/components/CoffeeUtensil.vue'
import ContactUs from '@/components/ContactUs.vue'
import Grading from '@/components/Grading.vue'
import Home from '@/components/Home.vue'
import ProcessingKnowledge from '@/components/ProcessingKnowledge.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from './routeName'
import ShopCar from '@/components/ShopCar.vue'
import Member from '@/components/Member.vue'
import ForgotPassword from '@/components/ForgotPassword.vue'
import VerifyCode from '@/components/VerifyCode.vue'
import OrderHistory from '@/components/OrderHistory.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: RouteName.HOME,
      component: Home
    },
    {
      path: '/contact',
      name: RouteName.CONTACT,
      component: ContactUs
    }
    ,
    {
      path: '/coffeeBeans',
      name: RouteName.COFFEE_BEANS,
      component: CoffeeBeans
    }
    ,
    {
      path: '/coffeeUtensil',
      name: RouteName.COFFEE_UTENSIL,
      component: CoffeeUtensil
    }
    ,
    {
      path: '/grading',
      name: RouteName.GRADING,
      component: Grading
    }
    ,
    {
      path: '/processing',
      name: RouteName.PROCESSING,
      component: ProcessingKnowledge
    },
    {
      path: '/shopCar',
      name: RouteName.SHOP_CAR,
      component: ShopCar
    }
    ,
    {
      path: '/member',
      name: RouteName.MEMBER,
      component: Member
    }
    ,
    {
      path: '/forgotPassword',
      name: RouteName.FORGOT_PASSWORD,
      component: ForgotPassword
    }
    ,
    {
      path: '/verifyCode',
      name: RouteName.VERIFY_CODE,
      component: VerifyCode
    }
    ,
    {
      path: '/orderHistory',
      name: RouteName.ORDER_HISTORY,
      component: OrderHistory
    }
  ]
})

export default router