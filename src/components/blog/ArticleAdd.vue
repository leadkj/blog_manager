<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>博客</el-breadcrumb-item>
      <el-breadcrumb-item>文章</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片内容-->
    <el-card>
      <el-button @click="$router.back()" icon="el-icon-arrow-left" type="info" size="mini">返回</el-button>
      <el-divider></el-divider>
      <el-form :model="articleForm" :rules="rules" ref="articleFormRef" label-width="100px" class="demo-articleForm"
               size="mini">
        <el-form-item label="文章名称" prop="name" required>
          <el-col :span="11">
            <el-input v-model="articleForm.name"></el-input>
          </el-col>

        </el-form-item>
        <el-form-item label="描述" prop="desc" required>
          <el-col :span="11">
            <el-input v-model="articleForm.desc"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="发布时间" required>
          <el-col :span="11">
            <el-form-item prop="publish">
              <el-date-picker type="date" placeholder="选择日期" v-model="articleForm.publish"
                              style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="文章内容" prop="content" required>
          <VueEditor style="width: 80%"
                     useCustomImageHandler @image-added="handleImageAdded"
                     :editorToolbar="customToolbar"
                     v-model="articleForm.content"></VueEditor>
        </el-form-item>
        <el-form-item label="浏览量" prop="read" required>
          <el-col :span="2">
            <el-input v-model="articleForm.read"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="点赞" prop="like" required>
          <el-col :span="2">
            <el-input v-model="articleForm.like"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="是否原创" prop="original">
          <el-switch v-model="articleForm.original"></el-switch>
        </el-form-item>
        <!--        <el-form-item label="作者" prop="author" required>-->
        <!--          <el-select v-model="articleForm.author" placeholder="请选择作者">-->
        <!--            <el-option :label="author.username+'('+author.nick_name+')'" :value="author.id" v-for="author in  authors"-->
        <!--                       :key="author.id"></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="分类" prop="category" required>
          <el-select v-model="articleForm.category" placeholder="请选择分类">
            <el-option :label="category.name" :value="category.id" v-for="category in  categorys"
                       :key="category.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tag">
          <el-select v-model="articleForm.tag" multiple placeholder="请选择标签">
            <el-option
                v-for="tag in taglist"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">立即创建</el-button>
          <el-button @click="$refs['articleFormRef'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
// import VueEditor from 'vue2-editor'

export default {
  name: "ArticleAdd",
  // comments: {
  //   VueEditor
  // },
  data() {
    return {
      articleForm: {
        name: '',
        desc: '',
        publish: '',
        content: '',
        read: 0,
        like: 0,
        original: false,
        category: '',
        tag: '',
        author: 1
      },
      rules: {
        name: [
          {required: true, message: '输入名称', trigger: 'blur'},
          // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
      },
      content: '',
      customToolbar: [
        ['bold', 'italic', 'underline'],
        [{'align': ''}, {'align': 'center'}, {'align': 'right'}],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
        [{'background': []}, {'color': []}],
        ['image', 'link'],
        ['strike'],
        ['clean'],
        ['blockquote', 'code-block']

      ],
      taglist: [],
      categorys: [],
    }
  },
  methods: {
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      let formData = new FormData();
      formData.append('image', file);
      this.$http({
        url: 'articles/imageUpload/',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      }).then(res => {
        Editor.insertEmbed(cursorLocation, 'image', res.data.url);
        resetUploader();
      }).catch(err => {
        console.log(err);
        this.$message.error("图片上传失败")
      })

    },
    submitForm() {
      this.$http.post('articles/', this.articleForm).then(res => {
        this.$message.success("文章发布成功")
        this.$refs['articleFormRef'].resetFields();
      }).catch(err => {
        this.$message.error("发布文章失败")
      })
    },
    getCategorys() {
      this.$http.get('categorys/',).then(res => {
        this.categorys = res.data.results
      }).catch(err => {
        this.$message.error("获取数据失败")
      })
    },
    getTages() {
      this.$http.get('tags/',).then(res => {
        this.taglist = res.data.results
      }).catch(err => {
        this.$message.error("获取数据失败")
      })
    },
  },
  created() {
    this.getTages()
    this.getCategorys()
  }

}
</script>

<style lang="less" scoped>

</style>