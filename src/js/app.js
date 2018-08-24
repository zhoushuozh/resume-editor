let app = new Vue({
    el: "#app",
    data: {
        resume: {
            name: "你的名字",
            objective: "前端工程师",
            city: '郑州',
            education: '本科',
            age: '24',
            phone: '12345678910',
            email: 'example@example.com',
            site: 'example.com',
            introduction: '用一段简短的文字介绍自己，凸出自己的优势。',
            workexpe: [
                {
                    date: '2016-06 - 2018-05',
                    company: '公司名称',
                    post: '所任职位',
                    description: '详细描述你的职责范围、工作任务及取得的成绩，工作经验的时间采取倒叙形式，最近经历写在前面，描述尽量具体简洁，工作经验的描述与目标岗位的招聘要求尽量匹配，用词精准。',
                },
            ],
            eduexpe: [
                {
                    date: '2012-09 - 2016-06',
                    school: '学校名称',
                    discipline: '所学专业',
                    description: '尽量简洁，突出重点，成绩优异的话建议写上GPA及排名等信息，如：GPA：3.72/4（专业前10%）GRE：324'
                }
            ],
            skills: [
                {
                    name: '技能名称',
                    description: 'PHP/ Python/ Node/ Ruby/ Elixir （掌握/基础/理解/熟练应用/使用XXX开发Web应用/开发API/)'
                },
                {
                    name: '前端框架',
                    description: 'Bootstrap/ AngularJS/ EmberJS/ Vue/ React （掌握/基础/熟练应用/使用XXX开发XXX）'
                },
            ],
            projects: [
                {
                    date: '2018-04 - 2018-05',
                    name: "项目名称",
                    role: "项目中承担的角色",
                    description: "描述你参加的项目负责的工作内容，内容清晰，突出重点，如项目描述、项目职责、项目业绩，建议加入超链接。",
                },
                {
                    date: '2018-04 - 2018-05',
                    name: "项目名称",
                    role: "项目中承担的角色",
                    description: "描述你参加的项目负责的工作内容，内容清晰，突出重点，如项目描述、项目职责、项目业绩，建议加入超链接。",
                },
            ],
        },
        dialog:{
            visibleMask: false,
            visibleDialog: false,
            visibleLogin: false,
            visibleSignUp: false,
            signUpSuccess: false,
        },
        signUpForm:{
            email: '',
            passwd: '',
            confirmPasswd: '',
            emailError: '',
            passwdError: '',
            confirmPasswdError: '',
        },
        logInForm:{
            email: '',
            passwd: '',
            emailError: '',
            passwdError: '',
        },
        currentUser: '',
        loginReminder: '请注意，当前处于预览状态，数据不会被保存，请登录后制作!',
        updatePrompt: {
            visible: false,
            message: ''
        },
    },
    methods: {
        onEdit(key,value){
            this.resume[key] = value;
        },
        /*显示登录对话框*/
        showLogin(e){
            if(e){
                e.preventDefault();
            }
            this.showDialog();
            if(this.dialog.visibleSignUp){
                this.dialog.visibleSignUp = false;
            }else if(this.dialog.signUpSuccess){
                this.dialog.signUpSuccess = false;
            }
            this.dialog.visibleLogin = true;
        },
        /*显示注册对话框*/
        showSignUp(e){
            if(e){
                e.preventDefault();
            }
            this.showDialog();
            if(this.dialog.visibleLogin){
                this.dialog.visibleLogin = false;
            }
            this.dialog.visibleSignUp = true;
        },
        /*弹出对话框*/
        showDialog(){
            this.dialog.visibleMask = true;
            this.dialog.visibleDialog = true;
        },
        /*登录成功*/
        signUpSuccess(e){
            if(e){
                e.preventDefault();
            }
            this.showDialog();
            this.dialog.visibleSignUp = false;
            this.dialog.signUpSuccess = true;
        },
        /*关闭对话框*/
        closeDialog(){
            this.dialog.visibleMask = false;
            this.dialog.visibleDialog = false;
        },
        /*时间格式转换*/
        timeConversion(time){
             let date = new Date(time);
             return date.getFullYear() + '/' +
                (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/' +
                date.getDate() + ' ' +
                date.getHours() + ':' +
                date.getMinutes() + ':' +
                date.getSeconds();
        },
        /*保存*/
        saveResume(e){
            e.preventDefault();
            let currentUser = AV.User.current();
            if(currentUser){
                let id = currentUser.id;
                console.log(this.resume);
                let user = AV.Object.createWithoutData('User', id);
                // 修改属性
                console.log(this.resume);
                user.set('resume', this.resume);
                // 保存到云端
                user.save().then((res)=>{
                    let updateTime = this.timeConversion(res.updatedAt);
                    this.updatePrompt.message = '保存成功，' + updateTime;
                },(error)=>{
                    console.log(error);
                    console.log('保存失败');
                });
            }else{
                this.showLogin();
            }
        },
        /*注册*/
        onSignUp(){
            let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            let reg = /^[\w]{8,14}$/;
            let emailError = '',
                passwdError = '',
                confirmPasswdError = '';

            if(!this.signUpForm.email){
                emailError = "邮箱不能为空";
                this.signUpForm.emailError = emailError;
                return
            } else if(!pattern.test(this.signUpForm.email)){
                emailError = '邮箱格式不正确';
                this.signUpForm.emailError = emailError;
                return
            } else{
                this.signUpForm.emailError = '';
            }

            if(!this.signUpForm.passwd){
                passwdError = '密码不能为空！';
                this.signUpForm.passwdError = passwdError;
                return;
            } else if(!this.signUpForm.passwd.match(reg)){
                passwdError = '请输入8到14位的密码！';
                this.signUpForm.passwdError = passwdError;
                return;
            } else{
                this.signUpForm.passwdError = '';
            }


            if(!this.signUpForm.confirmPasswd){
                confirmPasswdError = '请再次确认密码！';
                this.signUpForm.confirmPasswdError = confirmPasswdError;
                return
            } else if(!(this.signUpForm.passwd === this.signUpForm.confirmPasswd)){
                confirmPasswdError = '密码不一致！';
                this.signUpForm.confirmPasswdError = confirmPasswdError;
                return
            }else{
                this.signUpForm.confirmPasswdError = '';
            }

            // 新建 AVUser 对象实例
            let user = new AV.User();
            // 设置用户名
            user.setUsername(this.signUpForm.email);
            // 设置密码
            user.setPassword(this.signUpForm.passwd);
            // 设置邮箱
            user.setEmail(this.signUpForm.email);
            user.signUp().then((user) => {
                console.log(user);
                this.signUpSuccess();
            }, (error) => {
                switch (error.code) {
                    case 203:
                        emailError = '此邮箱已被注册！';
                        break;
                    default:
                        emailError = error.code + '：' + error.error;
                }
                this.signUpForm.emailError = emailError;
            });
        },
        /*登录*/
        onLogin(){
            let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            let reg = /^[\w]{8,14}$/;
            let emailError = '',
                passwdError = '';


            if(!this.logInForm.email){
                emailError = '邮箱不能为空';
                this.logInForm.emailError = emailError;
                return
            } else if(!pattern.test(this.logInForm.email)){
                emailError = '邮箱格式不正确';
                this.logInForm.emailError = emailError;
                return
            } else{
                this.logInForm.emailError = '';
            }

            if(!this.logInForm.passwd){
                passwdError = '密码不能为空';
                this.logInForm.passwdError = passwdError;
                return
            }else{
                this.logInForm.passwdError = ''
            }

            AV.User.logIn(this.logInForm.email, this.logInForm.passwd).then((res) => {
                this.currentUser = res.attributes.username;
                this.closeDialog();
                window.location.reload();
            }, (error) => {
                switch (error.code){
                    case 210:
                        passwdError = '邮箱和密码不匹配！';
                        break;
                    case 211:
                        emailError = '邮箱不存在！';
                        break;
                    case 216:
                        emailError = '电子邮件地址未经过验证。';
                        break;
                    case 219:
                        passwdError = '登录失败次数超过限制，请稍候再试！';
                        break;
                    default :
                        passwdError = error.code+'：'+error.error;
                }
                this.logInForm.emailError = emailError;
                this.logInForm.passwdError = passwdError;
            });
        },
        /*登出*/
        logout(){
            AV.User.logOut();
            window.location.reload();
        },
        /*查询简历*/
        getResume(id){
            let query = new AV.Query('User');
            query.get(id).then((user) => {
                if(user.attributes.resume){
                    Object.assign(this.resume, user.attributes.resume);
                    let updateTime = this.timeConversion(user.updatedAt);
                    this.updatePrompt.message = '上次更新时间：' + updateTime;
                }
            }, (error) => {
                console.log(error);
            });
        },
        /*查询当前是否登录*/
        hasLogin(){
            let current = AV.User.current();
            if(current){
                this.getResume(current.id);
                this.currentUser = current.attributes.username;
                this.updatePrompt.visible = true;
            }else{
                this.currentUser = '';
                this.updatePrompt.visible = false
            }
        }
    },
    created(){
        this.hasLogin();
    }
});