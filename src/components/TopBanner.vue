<script setup lang="ts">
import { ref } from 'vue';
import { RouteName } from '@/router/routeName';
import { useAuth } from '@/stores/auth';
import { useCart } from '@/stores/cart';
import { useWishlist } from '@/stores/wishlist';
import IconCart from './icons/IconCart.vue';
import IconMember from './icons/IconMember.vue';
import IconOrderHistory from './icons/IconOrderHistory.vue';
import IconHeart from './icons/IconHeart.vue';
import coffeeLogo from '@/assets/images/coffee_logo.png';

const { isLoggedIn, logout } = useAuth()
const { totalCount } = useCart()
const { wishlistIds } = useWishlist()

const roastLevels = ['淺焙', '中焙', '深焙']
const utensilCategories = ['濾杯', '磨豆機', '耗材', '其餘用具']

const activeDropdown = ref<'beans' | 'utensil' | 'member' | null>(null)

function openDropdown(key: 'beans' | 'utensil' | 'member') {
  activeDropdown.value = key
}

function closeDropdown() {
  activeDropdown.value = null
}

function toggleDropdown(key: 'beans' | 'utensil' | 'member') {
  activeDropdown.value = activeDropdown.value === key ? null : key
}

function handleLogout() {
  logout()
  closeDropdown()
}
</script>

<template>
    <div class="site-header">
        <RouterLink :to="{ name: RouteName.HOME }" class="brand">
            <img :src="coffeeLogo" class="brand__logo" alt="logo" />
            <span class="brand__name">Coffee House</span>
        </RouterLink>

        <nav>
            <div
                class="nav-item"
                @mouseenter="openDropdown('beans')"
                @mouseleave="closeDropdown()"
                @keydown.esc="closeDropdown()"
            >
                <RouterLink
                    :to="{ name: RouteName.COFFEE_BEANS }"
                    class="nav-link"
                    aria-haspopup="true"
                    :aria-expanded="activeDropdown === 'beans'"
                    @click="toggleDropdown('beans')"
                >Coffee Beans</RouterLink>
                <transition name="dropdown-fade">
                    <ul v-if="activeDropdown === 'beans'" class="dropdown">
                        <li v-for="roast in roastLevels" :key="roast">
                            <RouterLink
                                :to="{ name: RouteName.COFFEE_BEANS, query: { roast } }"
                                @click="closeDropdown()"
                            >{{ roast }}</RouterLink>
                        </li>
                    </ul>
                </transition>
            </div>

            <div
                class="nav-item"
                @mouseenter="openDropdown('utensil')"
                @mouseleave="closeDropdown()"
                @keydown.esc="closeDropdown()"
            >
                <RouterLink
                    :to="{ name: RouteName.COFFEE_UTENSIL }"
                    class="nav-link"
                    aria-haspopup="true"
                    :aria-expanded="activeDropdown === 'utensil'"
                    @click="toggleDropdown('utensil')"
                >Coffee Utensil</RouterLink>
                <transition name="dropdown-fade">
                    <ul v-if="activeDropdown === 'utensil'" class="dropdown">
                        <li v-for="category in utensilCategories" :key="category">
                            <RouterLink
                                :to="{ name: RouteName.COFFEE_UTENSIL, query: { category } }"
                                @click="closeDropdown()"
                            >{{ category }}</RouterLink>
                        </li>
                    </ul>
                </transition>
            </div>

            <RouterLink :to="{ name: RouteName.PROCESSING }" class="nav-link">Processing Knowledge</RouterLink>
            <RouterLink :to="{ name: RouteName.GRADING }" class="nav-link">Grading</RouterLink>
            <RouterLink :to="{ name: RouteName.CONTACT }" class="nav-link">Contact Us</RouterLink>
        </nav>

        <RouterLink
            v-if="isLoggedIn"
            :to="{ name: RouteName.ORDER_HISTORY }"
            class="order-history-button"
            aria-label="訂單紀錄"
        >
            <IconOrderHistory />
        </RouterLink>

        <div
            class="nav-item member-item"
            @mouseenter="openDropdown('member')"
            @mouseleave="closeDropdown()"
            @keydown.esc="closeDropdown()"
        >
            <button
                type="button"
                class="member-button"
                aria-label="會員"
                aria-haspopup="true"
                :aria-expanded="activeDropdown === 'member'"
                @click="toggleDropdown('member')"
            >
                <IconMember />
            </button>
            <transition name="dropdown-fade">
                <ul v-if="activeDropdown === 'member'" class="dropdown dropdown--right">
                    <template v-if="!isLoggedIn">
                        <li>
                            <RouterLink :to="{ name: RouteName.MEMBER, query: { tab: 'login' } }" @click="closeDropdown()">登入</RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ name: RouteName.MEMBER, query: { tab: 'register' } }" @click="closeDropdown()">註冊</RouterLink>
                        </li>
                    </template>
                    <template v-else>
                        <li>
                            <button type="button" class="dropdown__logout" @click="handleLogout">登出</button>
                        </li>
                    </template>
                </ul>
            </transition>
        </div>

        <RouterLink :to="{ name: RouteName.WISHLIST }" class="wishlist-button" aria-label="我的收藏">
            <IconHeart />
            <span v-if="wishlistIds.size > 0" class="badge">{{ wishlistIds.size }}</span>
        </RouterLink>

        <RouterLink :to="{ name: RouteName.SHOP_CAR }" class="cart-button" aria-label="購物車">
            <IconCart />
            <span v-if="totalCount > 0" class="badge">{{ totalCount }}</span>
        </RouterLink>
    </div>
</template>

<style scoped>
.site-header {
    display: flex;
    align-items: center;
    gap: 24px;
    width: 100%;
    padding: 0 24px;
    background: linear-gradient(90deg, var(--color-brand-dark), var(--color-brand));
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.brand {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
    text-decoration: none;
    color: var(--color-on-brand);
    flex-shrink: 0;
}

.brand__logo {
    width: 36px;
    height: 36px;
    object-fit: contain;
    border-radius: 6px;
}

.brand__name {
    font-size: 1.15rem;
    font-weight: bold;
    white-space: nowrap;
}

nav {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
}

.nav-item {
    position: relative;
    display: flex;
}

.nav-link {
    display: flex;
    align-items: center;
    padding: 16px 14px;
    text-decoration: none;
    color: var(--color-on-brand);
    opacity: 0.85;
    white-space: nowrap;
    transition: opacity 0.2s, background-color 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.12);
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 10;
    min-width: 140px;
    margin: 0;
    padding: 6px;
    list-style: none;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.dropdown li a {
    display: block;
    padding: 8px 12px;
    border-radius: 6px;
    color: var(--color-text);
    text-decoration: none;
}

.dropdown li a:hover {
    background: var(--color-background-mute);
    color: var(--color-brand);
}

.dropdown--right {
    left: auto;
    right: 0;
}

.dropdown__logout {
    display: block;
    width: 100%;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: none;
    color: var(--color-text);
    text-align: left;
    cursor: pointer;
}

.dropdown__logout:hover {
    background: var(--color-background-mute);
    color: var(--color-brand);
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

.order-history-button,
.member-button,
.wishlist-button,
.cart-button {
    position: relative;
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: none;
    color: var(--color-on-brand);
    cursor: pointer;
}

.order-history-button svg,
.member-button svg,
.wishlist-button svg,
.cart-button svg {
    width: 22px;
    height: 22px;
}

.order-history-button:hover,
.member-button:hover,
.wishlist-button:hover,
.cart-button:hover {
    background-color: rgba(255, 255, 255, 0.15);
}

.badge {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #f5a623;
    color: #3a2a00;
    font-size: 0.7rem;
    font-weight: bold;
    line-height: 1;
}
</style>
