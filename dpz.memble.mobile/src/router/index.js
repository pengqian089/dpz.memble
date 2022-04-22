import {createRouter, createWebHashHistory} from 'vue-router';
import SettingsView from '../views/SettingsView.vue';
import ArticleView from "../views/ArticleView.vue";
import MumbleView from "../views/MumbleView.vue";
import TimelineView from "../views/TimelineView.vue";
import EditArticleView from "@/views/EditArticleView";
import PublishArticleView from "@/views/PublishArticleView";
import PublishTimeline from "@/views/PublishTimelineView";
import EditTimelineView from "@/views/EditTimelineView";
import EditMumbleView from "@/views/EditMumbleView";
import PublishMumbleView from "@/views/PublishMumbleView";

const routes = [
    {
        path: '/',
        name: 'home',
        component: SettingsView,
        meta: {
            title: "基本设置"
        }
    },
    {
        path: '/article',
        name: 'article',
        component: ArticleView,
        meta: {
            title: "我的文章列表"
        }
    },
    {
        path: '/article/edit/:id',
        name: "edit-article",
        component: EditArticleView,
        meta: {
            title: "编辑文章"
        }
    },
    {
        path: '/article/publish',
        name: "publish-article",
        component: PublishArticleView,
        meta: {
            title: "发布文章"
        }
    },
    {
        path: '/mumble',
        name: 'mumble',
        component: MumbleView,
        meta: {
            title: "我的碎碎念列表"
        }
    },
    {
        path: "/mumble/edit/:id",
        name: 'edit-mumble',
        component: EditMumbleView,
        meta: {
            title: "修改碎碎念"
        }
    },
    {
        path: "/mumble/publish",
        name: 'publish-mumble',
        component: PublishMumbleView,
        meta: {
            title: "发布碎碎念"
        }
    },
    {
        path: '/timeline',
        name: 'timeline',
        component: TimelineView,
        meta: {
            title: "我的时间轴列表"
        }
    },
    {
        path: "/timeline/publish",
        name: "publish-timeline",
        component: PublishTimeline,
        meta: {
            title: "发布时间轴"
        }
    },
    {
        path: "/timeline/edit/:id",
        name: "edit-timeline",
        component: EditTimelineView,
        meta: {
            title: "修改时间轴"
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
