<style lang="less" scoped>
@import '../index.less';
</style>
<template>
  <div class="fusion-manage">
    <div class="fusion-header serve">
      <div class="btnsCreate">
        <Button @click="newCompany" class="create">新建公司</Button>
        <Poptip trigger="hover" content="批量导入数据">
          <Button icon="ios-open-outline" class="exportButton" @click="leadIn" />
        </Poptip>
      </div>
      <Row class="check-condition clearfix">
        <Form :label-width="80">
          <FormItem label="公司名称" class="mgr">
            <Input v-model="companySearch" placeholder="公司名称" />
          </FormItem>
          <div class="btns">
            <Button @click="search" class="search">查询</Button>
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
        <template slot-scope="{ row, index }" slot="action">
          <Button type="text" size="small" @click="show(row, index)">查看</Button>
          <Button type="text" size="small" @click="change(row, index)">修改</Button>
        </template>
      </Table>
      <pagination
        :page-size="10"
        :show-info="true"
        :currentPage="page"
        :total="total"
        @on-change="pageChange"
      />
    </div>
    <Modal v-model="delFlag" title="提示" @on-ok="delOk">
      <p>此操作将永久删除用户相关数据，是否确认删除？</p>
    </Modal>
    <Modal v-model="resetFlag" title="提示" @on-ok="resetOk">
      <p>确认重置密码？（默认密码为123456）</p>
    </Modal>
  </div>
</template>
<style lang="less" scoped></style>
<script>
// import { userPolicyList, commenSelect } from '../../../../api/policy/policy'
// import { dateFormat } from '../../../../libs/tools'

export default {
    components:{
        above,
        menuCheck,
    },
    data(){
        return{
            srow:'',
            index:'',
            total:'',
            page: 1,//默认为第一页
            companySearch:'',//搜索公司的字段
            data:[],//后台来的数据
            columns: [//Todo写成和后台一样的
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
                    render:(h,params)=>{
                        let tmpStr = "";
                        if(params.row.flag==1){
                            tmpStr="启用";
                        }else if(params.row.flag==2){
                            tmpStr="禁用";
                        }
                        return h('span',tmpStr)
                    }
                },
                {
                    title:'操作',
                    slot:'action',
                    align:'center'
                }
            ],
        }
    },
    created(){
        this.getData(1);
    },
    methods: {
        newCompany(){
            this.$router.push('/companyOperate')
        },
        show(row,index){
            this.srow=row;
            this.index=index;
            console.log(this.srow,this.index)
            this.$router.push(
                {
                    path:'/companyOperate',
                    query:{data:this.srow,flag:true}
                }
            )
        },
        change(row,index){
            this.srow=row;
            this.index=index;
            console.log(this.srow,this.index)
            this.$router.push(
                {
                    path:'/companyOperate',
                    query:{data:this.srow,flag:false}
                }
            )
        },
        search(){
            this.getData(1);
            this.page=1;
        },
        leadIn(){
            //Todo批量导入的方法
        },
        getData(page){
            axios.axios({
                method:'post',
                url:'userinfo/companyList',
                data:{pageSize:10,currentPage:page,condition:{comName:this.companySearch}},
                headers:{'token':localStorage.getItem("token")}
            }).then((data)=>{
                this.total=data.data.total;
                this.data=data.data.data;
                console.log(data)
            });
        },
        pageChange(page) {
            this.page = page ;
            this.getData(page);
            console.log(this.page);
        },
    },
}
</script>
