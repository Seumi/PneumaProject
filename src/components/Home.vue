<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo">
                <img src="../assets/logo.png"/>
            </el-col>
            <el-col :span="4" class="usermenu">
                <el-dropdown trigger="hover" style="height:70px;">
                    <span class=" el-dropdown-link usermenu-inner">{{ getUsername }} <img src="../assets/user.png" /></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <el-container style="height:100%">
                <el-aside width="250px" class="aside-menu">
                    <el-menu background-color="rgb(249, 255, 252)" router>
                        <el-menu-item index="/main">
                            <span slot="title"><i class="fa fa-tachometer" aria-hidden="true"></i>仪表盘</span>
                        </el-menu-item>
                        <!-- <el-menu-item index="/personset">
                            <span slot="title"><i class="fa fa-user-circle" aria-hidden="true"></i>个人设置</span>
                        </el-menu-item>
                        <el-menu-item index="/systemset">
                            <span slot="title"><i class="fa fa-cogs" aria-hidden="true"></i>系统设置</span>
                        </el-menu-item> -->
                        <el-menu-item index="/help">
                            <span slot="title"><i class="fa fa-yelp" aria-hidden="true"></i>帮助</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-scrollbar class="page-component__scroll">
                    <div class="main-container">
                        <transition name="el-fade-in-linear" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </div>
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-col>
    </el-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            test: 1
        }
    },
    methods:{
        logout() {
            this.$confirm('是否要注销登录','提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$store.dispatch('Logout');
                if(!this.$store.state.token) {
                    this.$router.push('/login');
                }
            })
        }
    },
    computed: {
    ...mapGetters([
            'getUsername'
        ])
    }
  
}
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    .header {
        position: fixed;
        z-index: 1500;
        height: 70px;
        background: #41B883;
        line-height: 70px;
        .logo {
            width: 200px;
            img {
                margin-left: 35px;
                vertical-align: middle;
            }
        }
        .usermenu {
            text-align: right;
            cursor: pointer;
            padding-right: 35px;
            height: 70px;
            float: right;
            .usermenu-inner {
                color: #ffffff;
                img {
                    width: 45px;
                    height: 45px;
                    margin-left: 10px;
                    margin-top: 12.5px;
                    margin-bottom: 12.5px;
                    border-radius: 30px;
                    vertical-align: middle;
                }
            }
        }
    }
    .aside-menu {
        .el-menu {
			height: 100%;
            background-color: rgb(249, 255, 252);
		}
        .el-menu-item {
            text-align: left;
            padding-left: 30px!important;
            font-size: 14px;
            i {
                margin-right: 10px;
            }
        }
    }
    .el-main{
        padding: 0;
    }
    .main {
        height: 100%;
        padding-top: 70px;
    }
    .page-component__scroll {
       height: 100%;
    }
    .page-component__scroll .el-scrollbar__wrap {
       overflow: auto ;
    }
    
}
</style>
