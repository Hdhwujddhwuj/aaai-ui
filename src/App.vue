<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import {
    Document,
    Menu as IconMenu,
    Operation,
    Tools as Options,
    User,
    HomeFilled
} from '@element-plus/icons-vue';
import {
    ElMenu,
    ElMenuItem,
    ElIcon,
} from 'element-plus';
import { ref, watch } from "vue";
import { useOptionsStore } from "@/stores/options";
import { useUIStore } from "./stores/ui";
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import CircleFilled from "./components/icons/CircleFilled.vue";
import MainMenuItem from "./components/MainMenuItem.vue";
import ImageDialog from './components/ImageDialog.vue';

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smallerOrEqual('md');

const uiStore = useUIStore();
const optionStore = useOptionsStore();

const route  = useRoute();
const menuRef = ref();
watch(
    () => route.path,
    (activeIndex) => {
        if (menuRef.value) menuRef.value.open(activeIndex);
    },
)
</script>

<template>
    <el-menu
        :default-active="route.path"
        mode="horizontal"
        :router="true"
        :ellipsis="!isMobile"
        :class="isMobile ? 'mobile-menu' : 'menu'"
        ref="menuRef"
    >
        <el-menu-item index="/dashboard" class="center-vertical" v-if="!isMobile">
            <template #title>
                <div v-if="optionStore.options.colorMode == 'light'" style="font-size: 20px;"><img alt="Artifical Art Logo" src="/assets/logo.png" style="max-height:35px;margin-bottom: 10px;"/></div>
                <div v-else style="font-size: 20px;"><img alt="Artifical Art Logo" src="/assets/logo_w.png" style="max-height:35px;margin-bottom: 10px;"/></div>
            </template>
        </el-menu-item>
        <MainMenuItem :isMobile="isMobile" index="/dashboard" v-if="isMobile">
            <template #icon><el-icon><home-filled /></el-icon></template>
            <template #title>Dashboard</template>
        </MainMenuItem>
        <MainMenuItem :isMobile="isMobile" index="/">
            <template #icon>
                <div class="generator-icons">
                    <el-icon><operation /></el-icon>
                    <el-icon v-if="uiStore.showGeneratorBadge" class="generator-badge" :size="10"><circle-filled /></el-icon>
                </div>
            </template>
            <template #title>Generate</template>
        </MainMenuItem>
        <MainMenuItem :isMobile="isMobile" index="/images" >
            <template #icon><el-icon><icon-menu /></el-icon></template>
            <template #title>Images</template>
        </MainMenuItem>
        <MainMenuItem :isMobile="isMobile" index="/workers">
            <template #icon><el-icon><user /></el-icon></template>
            <template #title>Workers</template>
        </MainMenuItem>
        <MainMenuItem :isMobile="isMobile" index="/about"  >
            <template #icon><el-icon><document /></el-icon></template>
            <template #title>About</template>
        </MainMenuItem>
        <MainMenuItem :isMobile="isMobile" index="/options">
            <template #icon><el-icon><options /></el-icon></template>
            <template #title>Options</template>
        </MainMenuItem>
    </el-menu>
    <router-view />
    <ImageDialog />
</template>
  
<style scoped>
    .menu {
        margin-bottom: 20px;
        z-index: 100;
    }

    .generator-icons {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }

    .generator-badge {
        position: absolute;
        bottom: 9px;
        right: -7px;
        color: var(--el-color-danger) !important;
    }

    .mobile-menu {
        z-index: 100;
        position: fixed;
        bottom: 0;
        height: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        justify-content: center;
        --el-menu-bg-color: var(--el-mask-color)
    }

    .mobile-menu > * {
        width: 60px
    }

    .remove-item-styling {
        cursor: default;
        color: var(--el-menu-text-color) !important;
        background-color: transparent !important;
    }
    .remove-item-styling:hover {
        cursor: default;
        color: var(--el-menu-text-color) !important;
    }
</style>