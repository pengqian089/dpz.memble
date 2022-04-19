<template>
  <h1 class="page-title">我的文章列表</h1>
  <el-skeleton :rows="5" :loading="isLoading" v-if="isLoading"/>

  <div v-else v-loading="tableLoading" element-loading-text="加载中...">
    <el-table :data="articleList" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <p>状态: {{ props.row.state }}</p>
          <p>城市: {{ props.row.city }}</p>
          <p>地址: {{ props.row.address }}</p>
          <p>邮编: {{ props.row.zip }}</p>
        </template>
      </el-table-column>
      <el-table-column label="日期" prop="date"/>
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="状态" prop="state"/>
      <el-table-column label="城市" prop="city"/>
      <el-table-column label="地址" prop="address"/>
      <el-table-column label="邮编" prop="zip"/>
    </el-table>
    <el-pagination background layout="prev, pager, next" default-current-page="1" v-on:current-change="toPage"
                   :total="1000" :page-size="pageSize"/>
  </div>
</template>

<script>
export default {
  name: "ArticleView",
  data() {
    return {
      articleList: [
        {
          date: '2016-05-03',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-08',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-06',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        },
        {
          date: '2016-05-07',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
        }
      ],
      pageIndex: 1,
      pageSize: 20,
      isLoading: true,
      tableLoading: false
    };
  },
  mounted() {
    this.$nextTick(function () {
      let that = this;
      setTimeout(function () {
        that.isLoading = false;
      }, 3000);
    });
  },
  methods: {
    toPage(page) {
      let that = this;
      this.tableLoading = true;
      this.pageIndex = page;
      console.log(this.pageIndex);
      setTimeout(function () {
        that.tableLoading = false;
      }, 500);
    }
  }
}
</script>

<style scoped>

</style>