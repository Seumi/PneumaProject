<template>
    <div class="main-page">
        <h3>仪表盘</h3>
        
        <div class="func-btn">
            <el-input placeholder="作业集名称" v-model="searchtitle" :max="40" style="width:200px;"></el-input>
            <el-button type="primary" @click="handlesearch">查询</el-button>
            <el-button type="danger" @click.native="addWorkHandle"><i class="fa fa-plus" aria-hidden="true"></i> 新建作业集</el-button>
            <el-button @click="handleRefresh"><i class="fa fa-refresh" aria-hidden="true"></i> 刷新</el-button>
        </div>
        <div class="table-list">
          <el-table :data="data" v-loading="listLoading" style="text-align:left" :default-sort = "{prop: 'createtime', order: 'descending'}">
            <el-table-column label="当前作业集" header-align="center">
              <el-table-column type="index" width="60"></el-table-column>
              <el-table-column label="名称" prop="title" sortable></el-table-column>
              <el-table-column label="语言" prop="lang" width="200px" sortable></el-table-column>
              <el-table-column label="状态" prop="status" width="200px">
                <template slot-scope="scope">
                  <el-tag :type="tagType[scope.row.status.substr(0,5)]" disable-transitions>{{scope.row.status.substr(5)}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" prop="createtime" width="200px" sortable>
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left:10px">{{scope.row.createtime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handleView(scope.$index, scope.row)">查看</el-button>
                  <el-button type="text" size="small" style="color:#f78989" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="pag-bar">
          <el-pagination
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="pagesize"
            :total="total">
          </el-pagination>
        </div>

        <!-- 查看界面 -->
        <el-dialog title="查看作业集信息" :visible.sync="viewWorkVisible" :close-on-click-modal="false" width="700px">
            <div class="dialog">
             <table>
               <tr>
                 <td class="left">作业集名称</td>
                 <td class="right">{{viewData.title}}</td>
               </tr>
               <tr>
                 <td class="left">作业集语言</td>
                 <td class="right">{{viewData.lang}}</td>
               </tr>
               <tr>
                 <td class="left">状态</td>
                 <td class="right"><el-tag :type="tagType[viewData.status.substr(0,5)]" disable-transitions>{{viewData.status.substr(5)}}</el-tag></td>
               </tr>
               <tr>
                 <td class="left">检出阈值</td>
                 <td class="right">{{viewData.threshold + (viewData.thtype === '1'?'个':'%')}}</td>
               </tr>
               <tr>
                 <td class="left">灵敏度(MML)</td>
                 <td class="right">{{viewData.mml}}</td>
               </tr>
               <tr>
                 <td class="left">停用代码</td>
                 <td class="right">{{viewData.bc ? '使用':'不使用'}}</td>
               </tr>
               <tr>
                 <td class="left">备注</td>
                 <td class="right">
                   <el-input type="textarea" v-model="viewData.comment" rows="3" readonly></el-input>
                 </td>
               </tr>
               <tr>
                 <td class="left">日志</td>
                 <td class="right">
                   <el-input type="textarea" v-model="viewData.log" rows="4" readonly></el-input>
                 </td>
               </tr>
             </table>
             <div v-if="viewData.status === '[SUC]完成'" style="margin-top:20px">
               <el-button type="success" round @click="handleDownload(viewData.uuid)" :loading="downLoading">下载结果</el-button> 
             </div>
             <div v-if="viewData.status.indexOf('[ERR]') != -1" style="margin-top:20px">
               <el-upload action="/api/reupload"
                          :limit="1"
                          :before-upload="beforeUpload"
                          :on-success="fileSuccess"
                          :on-error="fileError"
                          :headers="uploadHeader"
                          :disabled="cantUpload"
                          ref="upload"
                          :data="viewData"
                          accept=".zip,.ZIP">
                  <el-button round type="primary" :loading="cantUpload">重新上传</el-button>
                </el-upload>
             </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
  getWorkSetList,
  delWorkSet,
  getByUUID,
  getResult,
  search
} from "../api/api";

export default {
  data() {
    return {
      searchtitle: "",
      total: 0,
      intervalid: "",
      page: 1,
      pagesize: 10,
      data: [],
      cantUpload: false,
      uploadHeader: {
        Authorization: window.sessionStorage.getItem("token")
      },
      viewData: {
        uuid: "",
        title: "",
        lang: "",
        mml: "",
        threshold: "",
        thtype: "",
        status: "",
        comment: "",
        createtime: ""
      },
      tagType: {
        "[ERR]": "danger",
        "[MSG]": "waring",
        "[SUC]": "success"
      },
      listLoading: false,
      downLoading: false,
      viewWorkVisible: false
    };
  },
  methods: {
    addWorkHandle() {
      this.$router.push({ path: "/addwork" });
    },
    fastCheckHandle() {
      this.$router.push({ path: "/fastcheck" });
    },
    getList(loading) {
      let param = {
        page: this.page,
        pagesize: this.pagesize,
        title: this.searchtitle
      };
      if (loading) {
        this.listLoading = true;
      }

      getWorkSetList(param).then(res => {
        let { code, msg } = res.data;
        if (code === "GETLISTSUCCESS") {
          //console.log(res.data.msg);
          this.data = msg.items;
          this.total = msg.total;
          if (loading) {
            this.listLoading = false;
          }
        } else if (code === "GETLISTFAIL") {
          this.$message({
            message: "获取作业集列表失败，请重试",
            type: "warning"
          });
        } else if (code === "INVALIDTOKEN" || code === "NOTOKEN") {
          this.$alert("你尚未登录或登录已过期，将转向登录页面", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.push({ path: "/login" });
            }
          });
        }
      });
    },
    beforeUpload(file) {
      this.cantUpload = true;
      let fileSize = file.size / 1024 / 1024;
      if (fileSize > 50) {
        let name = filterXSS(file.name);
        this.$notify({
          title: "错误",
          dangerouslyUseHTMLString: true,
          message:
            '文件<font color="red">' +
            filterXSS(file.name) +
            "</font>的大小超过20MB，无法进行分析，将不会被上传。"
        });
        return false;
      }
    },
    fileError(err, file, fileList) {
      this.cantUpload = false;
      this.$message({
        message: "重上传失败了嗼嗼T-T，请重试或联系管理员",
        type: "warning"
      });
    },
    fileSuccess(resp, file, fileList) {
      if (resp.code === "REUPLOADSUCCESS") {
        this.cantUpload = false;
        this.$alert("重上传成功", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.getList(false);
            this.viewWorkVisible = false;
            this.$router.push({ path: "/main" });
          }
        });
      } else if (resp.code === "REUPLOADERR") {
        this.cantUpload = false;
        this.$alert("不存在该作业集，重上传失败", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push({ path: "/main" });
          }
        });
      } else if (resp.code === "REUPLOADIOERR") {
        this.cantUpload = false;
        this.$alert("服务器IO错误，重上传失败", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push({ path: "/main" });
          }
        });
      } else if (resp.code === "INVALIDTOKEN" || resp.code === "NOTOKEN") {
        this.cantUpload = false;
        this.$alert("你尚未登录或登录已过期，将转向登录页面", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push({ path: "/login" });
          }
        });
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList(true);
    },
    handleDelete(index, row) {
      this.$confirm(
        "确认删除该作业集？(已生成的检测报告也将被删除，并无法恢复)",
        "提示",
        {
          type: "waring"
        }
      )
        .then(() => {
          this.listLoading = true;
          let param = {
            uuid: row.uuid
          };
          delWorkSet(param).then(res => {
            this.listLoading = false;
            let { code, msg } = res.data;
            if (code === "DELSUCCESS") {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getList(true);
            } else if (code === "DELFAIL") {
              this.$message({
                message: "删除失败:" + msg,
                type: "error"
              });
              this.getList(true);
            } else if (code === "INVALIDTOKEN" || code === "NOTOKEN") {
              this.$alert("你尚未登录或登录已过期，将转向登录页面", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.$router.push({ path: "/login" });
                }
              });
            }
          });
        })
        .catch(() => {});
    },
    handleView(index, row) {
      let param = {
        uuid: row.uuid
      };
      getByUUID(param)
        .then(res => {
          let { code, msg } = res.data;
          if (code === "GETONESUCCESS") {
            this.viewData = msg;
            this.viewData.log = msg.log.join("\n");
            this.viewWorkVisible = true;
          } else if (code === "GETONEFAIL") {
            this.$message({
              message: "获取失败:" + msg,
              type: "error"
            });
          } else if (code === "INVALIDTOKEN" || code === "NOTOKEN") {
            this.$alert("你尚未登录或登录已过期，将转向登录页面", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.push({ path: "/login" });
              }
            });
          }
        })
        .catch(() => {});
    },
    handleDownload(uuid) {
      this.downLoading = true;
      let param = {
        uuid: uuid
      };
      getResult(param).then(res => {
        this.downLoading = false;
        let { code, msg } = res.data;
        if (code === "ZIPSUCCESS") {
          window.open(msg.url);
        } else if (code === "RESULTNOTCREATE") {
          this.$message({
            message: "下载失败，可能作业集尚未解析完成或出现解析错误",
            type: "warning"
          });
        } else if (code === "ZIPERR") {
          this.$message({
            message: "下载失败，服务器内部错误",
            type: "warning"
          });
        } else if (code === "CANNOTFOUNDUUID") {
          this.$message({
            message: "下载失败，可能作业集尚未解析完成或出现解析错误",
            type: "warning"
          });
        } else if (code === "INVAILDUUID") {
          this.$message({
            message: "下载失败，参数错误，请重新登录",
            type: "warning"
          });
        } else if (code === "INVALIDTOKEN" || code === "NOTOKEN") {
          this.$alert("你尚未登录或登录已过期，将转向登录页面", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.push({ path: "/login" });
            }
          });
        }
      });
    },
    handlesearch() {
      if (this.searchtitle !== "") {
        this.getList(true);
      } else {
        this.$message({
          message: "查询内容不能为空",
          type: "warning"
        });
      }
    },
    handleRefresh() {
      this.searchtitle = "";
      this.getList(true);
    }
  },

  mounted() {
    this.getList();
    this.intervalid = setInterval(() => {
      for (let i = 0; i < this.data.length; i++) {
        if (
          this.data[i].status === "[MSG]预处理中" ||
          this.data[i].status === "[MSG]正在解析" ||
          this.data[i].status === "[MSG]初始化"
        ) {
          this.getList(false);
        }
      }
    }, 2000);
  },
  beforeDestroy() {
    clearInterval(this.intervalid);
  }
};
</script>

<style lang="scss" scoped>
.main-page {
  padding: 20px;
  padding-right: 37px;
  h3 {
    margin-top: 0;
    text-align: left;
  }

  .func-btn {
    height: 60px;
    background-color: #eeeeee;
    border-radius: 1px;
    text-align: left;
    padding-left: 10px;
    .el-button {
      margin-top: 10px;
    }
  }
  .table-list {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .pag-bar {
    float: right;
    margin-bottom: 50px;
  }
  th {
    color: #757575;
  }
  .dialog {
    padding-left: 40px;
    padding-right: 40px;
    font-size: 15px;
    tr {
      height: 35px;
    }
    .left {
      width: 100px;
      vertical-align: top;
      text-align: right;
      font-weight: bold;
    }
    .right {
      width: 500px;
      vertical-align: top;
      text-align: left;
      padding-left: 20px;
    }
  }
}
</style>
