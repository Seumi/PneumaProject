<template>
    <div class="fast-check-page">
        <h3>快速检测</h3>
        <div class="tip">
            <p>快速检测仅用于对少量(≤30)源代码文件进行快速抄袭检测，如果要进行大量文件的检测，请使用新建作业集功能。快速检测仅支持单文件对比，不支持添加源，且系统不会保存结果，请谨慎使用。更多支持请阅读<router-link to="/help">帮助</router-link>。</p>
        </div>
        <div class="upload-div">检测语言：
            <el-select v-model="lang" placeholder="请选择语言" @change="selectChange">
                <el-option v-for="item in langList" :key="item.value" :label="item.label" :value="item.value"> <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.ext }}</span>
                </el-option>
            </el-select>
            <el-button :disabled="isable" type="primary" @click="submitUpload" style="margin:0 0 40px 0;">上传</el-button>
            <el-upload :on-change="fileChange" 
                       :on-remove="fileRemove" 
                       :on-success="fileSuccess"
                       :on-error="fileError"
                       :before-upload="beforeUpload"
                       :on-exceed="fileExceed"
                       v-show="isshow" 
                       ref="upload"
                       drag 
                       :data="uploadParam"
                       :headers="uploadHeader"
                       :accept="accpetList" 
                       :file-list="filelist" 
                       action="/api/upload" 
                       multiple 
                       :disabled="cantUpload"
                       :limit="limit"
                       :auto-upload="false"> 
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将源代码或压缩文件拖到此处，或<em>点击选择</em>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传源代码或压缩文件，且不超过500kb</div>
            </el-upload>
        </div>
    </div>
</template>

<script>
import { uploadUUID } from '../api/api'

export default {
    data() {
        return {
            limit: 30,
            uuid: '',
            uploadParam: {},
            uploadHeader: {
                Authorization: window.sessionStorage.getItem('token')
            },
            filelist: [],
            isshow: false,
            isable: true,
            cantUpload: false,
            allFinish: false,
            accpetList: '.zip,.rar,.c,.cpp,.java,.cs,.txt,asp.,html,.htm,.aspx,.py,.rar,.zip',
            langList:[
                {value: 'lang0', label: 'Java1.7', ext: '.java'},
                {value: 'lang1', label: 'C/C++', ext: '.cpp/.c'},
                {value: 'lang2', label: 'Python3', ext: '.py'},
                {value: 'lang3', label: 'C#', ext: '.cs'},
                {value: 'lang4', label: '文本', ext: '纯文本文件'},
                {value: 'lang5', label: '字符', ext: '纯文本文件'}
            ],
            lang: ''
        }
    },
    methods: {
        submitUpload() {
            let payload = {
                langType : this.lang,
                flag : 'pneuma'
            };
            uploadUUID(payload).then(data => {
                let {code, msg} = data.data;
                if(code === 'GETUUIDSUCCESS') {
                    this.uploadParam.langType = this.lang;
                    this.uploadParam.uuid = msg;
                    this.uuid = msg;
                    this.cantUpload = true;
                    this.$refs.upload.submit();
                } else if (code === 'INVALIDTOKEN' || code === 'NOTOKEN') {
                    this.$confirm('您尚未登录或登录已过期，请重新登录','提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(() => {
                        this.$store.dispatch('Logout');
                        if(!this.$store.state.token) {
                            this.$router.push('/login');
                        }
                    });
                    return;                  
                } else if (code === 'GETUUIDFAIL' || code === 'INNERERROR') {
                    this.$notify({
                        title: '提示',
                        type: 'error',
                        message: '发生未知错误，请稍后重试'
                    })
                    return;
                }
            })
            
        },
        selectChange(data) {
            if (!this.isshow) {
                this.isshow = true;
            }
            return;
        },
        fileChange(file, fileList) {
            this.filelist = fileList;
            if (fileList.length == 0) {
                this.isable = true;
            } else {
                if (this.isable) {
                    this.isable = false;
                }
            }
        },
        fileRemove(file, fileList) {
            if (fileList.length == 0) {
                this.isable = true;
            }
        },
        fileExceed() {
            this.$message({
                message: '最多上传30个文件',
                type: 'warning'
            });
        },
        beforeUpload(file) {
            let fileSize = file.size / 1024 / 1024;
            if(fileSize > 2) {
                let name = filterXSS(file.name);
                this.$notify({
                    title: '错误',
                    dangerouslyUseHTMLString: true,
                    message: '文件<font color="red">' + file.name + '</font>的大小超过2MB，无法进行分析，将不会被上传。'
                });
                return false;               
            } 
        },
        fileSuccess(resp, file, fileList) {
            //this.filelist = fileList;
        },
        fileError(err, file, fileList) {
            //this.filelist = fileList;
            let name = filterXSS(file.name);
            this.$notify({
                title: '错误',
                type: 'warning',
                dangerouslyUseHTMLString: true,
                message: '文件<font color="red">' + file.name + '</font>上传失败。原因:' + err
            })
        }
    },
    watch: {
        filelist: (f) => {
            //console.log(f);
            for(var i in f) {
                //console.log(f[i]);
                if (f[i].status === 'ready' || f[i].status === 'uploading') {
                    return;
                }
            }
            console.log('all finish');
            this.allFinish = true;
        }
    }
  
}
</script>

<style lang="scss" scoped>
.fast-check-page {
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
        border-left: 5px solid #41B883;
        margin: 20px 0;
        text-align: left;
        p {
            font-size: 14px;
            color: #5e6d82;
            line-height: 1.5em;
        }
    }
    .upload-div {
        margin-left: 30px;
        text-align: left;
        width: 360px;
        
    }
    .el-upload-dragger{
        height: 100px;
    }
}

</style>
