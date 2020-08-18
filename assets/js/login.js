$(function () {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show();
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 从 layui 中获取 form 对象
    var form = layui.form
    // 自定义 form.verify() 函数自定义校验规则
    form.verify({
        username: function (value, item) {
            //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },
        // 自定义一个叫做 pwd 正则表达式
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须6-16位，且不能输入空格"
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            // 选择器后要有空格
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return "两次密码不一致！"
            }
        }
    })

    // 4. 注册功能
    var layer = layui.layer
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function (res) {
                if (res.status != 0) {
                    // console.log(res);
                    return layer.msg(res.message);
                }
                // 提交成功后处理代码
                layer.msg("注册成功，请登录！")
                // 模拟人的点击行为
                $('#link_login').click();
                // 重置form表单
                $('#form_reg')[0].reset()
            }
        })
    })

    // 5. 登录功能(给form标签绑定事件，button按钮触发提交 事件)
    $('#form_login').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到localStorage
                localStorage.setItem('token', res.token)
                // console.log(location.href);
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})