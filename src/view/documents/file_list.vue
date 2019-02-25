 <template>
  <div style="width:100%;height:100%;">
    <Upload multiple
            type="drag"
            action="//jsonplaceholder.typicode.com/posts/">
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"></Icon>
        <p>Click or drag files here to upload</p>
      </div>
    </Upload>
    <Button @click="handleSelectAll(true)">全 选</Button>
    <Button @click="handleSelectAll(false)">取消全选</Button>
    <Table ref="fileList"
           border
           stripe
           width='686'
           :columns="columns5"
           :data="fileData">
      <template slot-scope="{ row, index }"
                slot="share">
        <i-switch>
          <Icon type="md-checkmark"
                slot="open"></Icon>
          <Icon type="md-close"
                slot="close"></Icon>
        </i-switch>
      </template>
    </Table>

  </div>
</template>
<script>
export default {
  name: 'file_list',
  data () {
    return {
      columns5: [
        {
          //type 某一列的类型
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          type: 'index',
          width: 80,
          //title表头名
          title: '索引',
          //key对对应一下的字段名
          key: 'index',
          align: 'center'
        },
        {
          title: '文件名',
          key: 'fileName',
          sortable: true,
          align: 'center',
          // maxWidth: 400,
          // 超出部分显示为省略号
          ellipsis: true,
        },
        {
          title: '格式',
          key: 'fileFormat',
          align: 'center',
          maxWidth: 100,
          filters: [
            {
              label: 'ppt',
              value: 'ppt'
            },
            {
              label: 'word',
              value: 'word'
            },
            {
              label: 'excel',
              value: 'excel'
            }
          ],
          filterMethod (value, row) {
            return row.address.indexOf(value) > -1;
          }
        },
        {
          title: '分享',
          key: 'share',
          slot: 'share',
          align: 'center',
          maxWidth: 80,
        }
      ],
      fileData: []
    }
  },
  methods: {
    remove (index) {
      this.data6.splice(index, 1);
    },
    handleSelectAll (status) {
      this.$refs.fileList.selectAll(status);
    }

  },
}
</script>
