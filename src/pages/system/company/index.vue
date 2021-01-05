<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <div class="btnsCreate">
        <Button @click="newCompany('新建', '')" class="create">新建公司</Button>
        <Poptip trigger="hover" content="批量导入数据">
          <Button icon="ios-open-outline" class="exportButton" @click="leadIn" />
        </Poptip>
      </div>
      <Row class="check-condition clearfix">
        <Form :label-width="80">
          <FormItem label="公司名称" class="mgr">
            <Input v-model="companySearch" placeholder="公司名称" clearable />
          </FormItem>
          <div class="btns">
            <Button @click="getData(1)" class="search">查询</Button>
          </div>
        </Form>
      </Row>
    </div>
    <div class="policy-table">
      <!-- <div class="btns">
        <Button @click="userList(1)" class="search">下载</Button>
        <Button @click="reset(1)" class="reset">删除</Button>
      </div> -->
      <Table :columns="companyColums" :data="companyData" stripe>
        <template slot-scope="{ row }" slot="action">
          <span class="new-color" @click="newCompany('修改', row)">修改</span>
          <span class="new-color" @click="newCompany('查看', row)">查看</span>
        </template>
      </Table>
      <pagination
        :page-size="size"
        :show-info="true"
        :currentPage="current"
        :total="total"
        @on-change="getData"
        @on-page-size-change="userSize"
      />
    </div>
    <Modal v-model="exportModel" footer-hide title="">
      <Form
        :label-width="150"
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        style="margin-top:40px;"
      >
        <FormItem label="模板下载：">
          <a @click="downLoad" class="upload-a">公司导入模板.xls</a>
        </FormItem>
        <FormItem label="导入模板：" prop="uploadLogo">
          <Upload
            ref="uploadFile"
            :auto-upload="false"
            action=""
            :multiple="false"
            :show-upload-list="false"
            :before-upload="handleBefore"
            accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          >
            <Button type="primary">选择文件</Button>
            <div v-if="newfile !== null" style="margin-top:10px;">{{ newfile.name }}</div>
          </Upload>
        </FormItem>
      </Form>
      <div style="text-align: right">
        <Button type="primary" style="margin-right:15px;" @click="exportExcelOk">确定</Button>
        <Button type="text" @click="exportModel = false">取消</Button>
      </div>
    </Modal>
    <!-- <Modal v-model="delFlag" title="提示">
      <p>此操作将永久删除用户相关数据，是否确认删除？</p>
    </Modal>
    <Modal v-model="resetFlag" title="提示">
      <p>确认重置密码？（默认密码为123456）</p>
    </Modal> -->
  </div>
</template>
<style lang="less" scoped></style>
<script>
import { companyList, companyExport, down } from '../../../api/login'
import { urlPrefix } from '../../../libs/tools'
// import { dateFormat } from '../../../../libs/tools'
import axios from '../../../api/axios'
export default {
  components: {
    // above,
    // menuCheck
  },
  data() {
    return {
      srow: '',
      index: '',
      total: 0,
      current: 1, //默认为第一页
      size: 10,
      resetFlag: false,
      delFlag: false,
      exportModel: false,
      newfile: '',
      token: '',
      companySearch: '', //搜索公司的字段
      companyData: [], //后台来的数据
      formValidate: {
        uploadLogo: null
      },
      ruleValidate: {
        uploadLogo: [{ required: true, trigger: 'change' }]
      },
      companyColums: [
        //Todo写成和后台一样的
        {
          title: '公司名称',
          key: 'comName'
        },
        {
          title: '地区',
          key: 'region'
        },
        {
          title: '状态',
          key: 'flag',
          render: (h, params) => {
            if (params.row.flag === 1) {
              return h(
                'div',
                {
                  style: {
                    width: '60px',
                    height: '22px',
                    lineHeight: '22px',
                    borderRadius: '4px',
                    color: '#11DA16',
                    textAlign: 'center',
                    background: '#DAFCDB'
                  }
                },
                params.row.flag === 1 ? '启用' : '禁用'
              )
            } else {
              return h(
                'div',
                {
                  style: {
                    color: '#E02020',
                    background: '#FFDBDB',
                    borderRadius: '4px',
                    width: '60px',
                    height: '22px',
                    lineHeight: '22px',
                    textAlign: 'center'
                  }
                },
                params.row.flag === 1 ? '启用' : '禁用'
              )
            }
          }
          // render: (h, params) => {
          //   let tmpStr = ''
          //   if (params.row.flag == 1) {
          //     tmpStr = '启用'
          //   } else if (params.row.flag == 2) {
          //     tmpStr = '禁用'
          //   }
          //   return h('span', tmpStr)
          // }
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.token = localStorage.getItem('token')
  },
  created() {
    this.getData(1)
  },
  methods: {
    newCompany(title, data) {
      this.$router.push({ path: '/commanyAdd', query: { title: title, data: data } })
    },
    // show(row, index) {
    //   this.srow = row
    //   this.index = index
    //   console.log(this.srow, this.index)
    //   this.$router.push({
    //     path: '/companyOperate',
    //     query: { data: this.srow, flag: true }
    //   })
    // },
    // change(row, index) {
    //   this.srow = row
    //   this.index = index
    //   console.log(this.srow, this.index)
    //   this.$router.push({
    //     path: '/companyOperate',
    //     query: { data: this.srow, flag: false }
    //   })
    // },
    leadIn() {
      this.exportModel = true
      this.newfile = ''
    },
    // 模板下载
    downLoad() {
      window.location.href = `${urlPrefix}/api/userinfo/companyDownload`
      // window.open('http://api.dispatch-32102.p.onecode.ict.cmcc/api/userinfo/companyDownload')
    },
    // 上传文件
    handleBefore(file) {
      this.newfile = file
      return false
    },
    // 确定导入
    exportExcelOk() {
      if (this.newfile === '') {
        this.$Message.error('请选择要导入文件')
      } else {
        var formData = new FormData()
        formData.append('file', this.newfile)
        companyExport(formData).then(res => {
          console.log(res.state)
          if (res.data.state === '1') {
            this.$Message.success(res.data.message || '成功!')
            this.exportModel = false
            this.getData(1)
          } else {
            this.$Message.error(res.data.message || '失败!')
          }
        })
      }
    },
    getData(current) {
      if (current) this.current = current
      let params = {
        condition: { comName: this.companySearch },
        pageSize: this.size,
        currentPage: this.current
      }
      companyList(params).then(res => {
        console.log(res)
        this.total = res.total
        this.companyData = res.data
        // this.datadic.forEach(data => {
        //   if (data.dictClass === '9') {
        //     data.dictClass = '自定义'
        //   } else if (data.dictClass === '1') {
        //     data.dictClass = '国际标准'
        //   } else if (data.dictClass === '2') {
        //     data.dictClass = '国家标准'
        //   } else {
        //     data.dictClass = '行业标准'
        //   }
        // })
      })
      // axios
      //   .axios({
      //     method: 'post',
      //     url: '/api/userinfo/companyList',
      //     data: { pageSize: 10, currentPage: page, condition: { comName: this.companySearch } },
      //     headers: { token: localStorage.getItem('token') }
      //   })
      //   .then(data => {
      //     this.total = data.data.total
      //     this.data = data.data.data
      //     console.log(data)
      //   })
    },
    userSize: function(limit) {
      this.size = limit
      this.current = 1
      this.getData()
    }
  }
}
</script>
