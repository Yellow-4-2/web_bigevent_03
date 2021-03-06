$(function () {
    $('#link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide();
    })

    var form = layui.form;
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
    });

    var layer = layui.layer;

    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) return layer.msg(res.message);
                layer.msg(res.message);
                $('#link_login').click();
                $('#form_reg')[0].reset();
            }
        })
    })

    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) return layer.msg('登录失败！');
                layer.msg('登录成功!')
                localStorage.setItem('token', res.token)
                console.log(location.href);
                location.href = '/index.html'
            }
        })
    })
})