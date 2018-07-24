<template>
  <div class="add-page">
      <h3>新建作业集</h3>
      <div class="tip">
        <p>新建一个作业集并上传压缩文件进行检测，请上传文件夹结构合理的压缩文件。更多支持请阅读<router-link to="/help">帮助</router-link>。</p>
      </div>
      <div class="form-container">
        <el-form ref="form" :model="form" :rules="rule" label-width="100px" :disabled="cantUpload">

          <el-form-item label="作业集名称" prop="title">
            <el-input v-model="form.title" maxlength="40"></el-input>
          </el-form-item>

          <el-form-item label="作业集语言" prop="lang">
            <el-select v-model="form.lang" placeholder="请选择语言类型">
              <el-option label="Java" value="java"></el-option>
              <el-option label="C\C++" value="ccpp"></el-option>
              <el-option label="Python3" value="python"></el-option>
              <el-option label="C#" value="CSharp"></el-option>
              <el-option label="Web" value="web"></el-option>
              <el-option label="文本" value="text"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="停用代码">
            <el-switch v-model="form.bc"></el-switch>
          </el-form-item>

          <el-form-item label="检出阈值" prop="threshold">
            <el-input v-model="form.threshold" placeholder="请输入数字" class="input-with-select" style="width:200px">
              <el-select v-model="form.thtype" slot="append" placeholder="请选择" class="inner-select">
                <el-option label="个" value="1"></el-option>
                <el-option label="%" value="2"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="灵敏度(MML)">
            <el-slider v-model="form.mml" :min=5 :max=50 style="width:200px;"></el-slider>
            
          </el-form-item>

          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.comment" rows="3" :max=500></el-input>
          </el-form-item>

          <el-form-item label="上传文件">
            <el-upload :limit="1"
                       ref="upload"
                       :on-error="fileError"
                       drag
                       :file-list="filelist"
                       :before-upload="beforeUpload"
                       :on-success="fileSuccess"
                       :headers="uploadHeader"
                       :data="form"
                       :on-exceed="fileExceed"
                       :disabled="cantUpload"
                       action="/api/upload"
                       accept=".zip,.ZIP"
                       :auto-upload="false">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将压缩文件拖到此处，或<em>点击选择</em></div>
              <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过20MB</div>
            </el-upload>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    var vailth = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入检出阈值"));
      } else if (!parseInt(value)) {
        callback(new Error("必须为数字"));
      } else if (value < 3 || value > 100) {
        callback(new Error("范围为3~100"));
      } else {
        callback();
      }
    };
    return {
      alldone: false,
      haschange: false,
      cantUpload: false,
      filelist: [],
      uploadHeader: {
        Authorization: window.sessionStorage.getItem("token")
      },
      form: {
        title: "",
        lang: "",
        bc: false,
        threshold: 50,
        thtype: "1",
        mml: 10,
        comment: ""
      },
      rule: {
        title: [
          { required: true, message: "请输入作业集名称", trigger: "blur" },
          { min: 3, max: 40, message: "长度在 3 到 40 个字符", trigger: "blur" }
        ],
        lang: [{ required: true, message: "请选择语言", trigger: "change" }],
        threshold: [
          { required: true, message: "请输入检出阈值", trigger: "blur" },
          { validator: vailth, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    fileExceed() {
      this.$message({
        message: "最多上传1个文件",
        type: "warning"
      });
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
    beforeUpload(file) {
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
    submit() {
      this.cantUpload = true;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.upload.submit();
        } else {
          this.$message({
            message: "请正确填写表单项",
            type: "warning"
          });
        }
      });
    },
    fileError(err, file, fileList) {
      this.cantUpload = false;
      this.$message({
        message: "上传失败了嗼嗼T-T，请重试或联系管理员",
        type: "warning"
      });
    },
    fileSuccess(resp, file, fileList) {
      if (resp.code === "FILEUPLOADSUCCESS") {
        this.alldone = true;
        this.$alert("作业集创建成功，即将转向仪表盘", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push({ path: "/main" });
          }
        });
      } else if (resp.code === "FILEUPLOADERROR") {
        this.alldone = true;
        this.$alert("服务器内部错误，作业集创建失败，请联系管理员", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push({ path: "/main" });
          }
        });
      } else if (resp.code === "INVALIDTOKEN" || resp.code === "NOTOKEN") {
        this.alldone = true;
        this.$alert("你尚未登录或登录已过期，将转向登录页面", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push({ path: "/login" });
          }
        });
      }
    }
  },
  watch: {
    form: {
      handler(newValue, oldValue) {
        if (!this.haschange) {
          this.haschange = true;
        }
      },
      deep: true
    }
  },
  mounted: function() {
    this.$notify.info({
      title: "提示",
      message: "如果您是初次使用，请先阅读帮助"
    });
  },
  beforeRouteLeave(to, from, next) {
    if (this.haschange) {
      if (!this.alldone) {
        this.$confirm("作业集尚未保存，是否退出", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            next();
          })
          .catch(() => {
            next(false);
          });
      } else {
        next();
      }
    } else {
      next();
    }
  }
};
</script>

<style lang="scss" scoped>
.add-page {
  padding: 20px;
  h3 {
    margin-top: 0;
    text-align: left;
  }
  .tip {
    width: 500px;
    padding: 8px 16px;
    background-color: rgb(244, 255, 249);
    border-radius: 4px;
    border-left: 5px solid #41b883;
    margin: 20px 0;
    text-align: left;
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.5em;
    }
  }
  .form-container {
    text-align: left;
    width: 40%;
    min-width: 400px;
    .inner-select {
      width: 80px;
    }
  }
}
</style>
