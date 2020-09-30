import Vue from 'vue'
import {Button, TableColumn} from 'element-ui'
import {Form, FormItem} from 'element-ui'
import {Input} from 'element-ui'
import {Message} from "element-ui";
import {Container} from "element-ui";
import {Main} from "element-ui";
import {Header} from "element-ui";
import {Aside} from "element-ui";
import {Menu} from "element-ui";
import {Submenu} from "element-ui";
import {MenuItemGroup} from "element-ui";
import {MenuItem} from "element-ui";
import {Breadcrumb} from "element-ui";
import {BreadcrumbItem} from "element-ui";
import {Card} from "element-ui";
import {Row} from "element-ui";
import {Col} from "element-ui";
import {Table} from "element-ui";
import {Switch,Tooltip,Pagination,Dialog,Divider,DatePicker,Select,Option,TimePicker} from "element-ui";
import {Loading} from "element-ui";
import {PageHeader} from "element-ui";
Vue.use(PageHeader)
Vue.use(Loading)
Vue.use(Option)
Vue.use(TimePicker)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message   //message组件和其他组件不同调用方式
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Divider)
Vue.use(DatePicker)
Vue.use(Select)