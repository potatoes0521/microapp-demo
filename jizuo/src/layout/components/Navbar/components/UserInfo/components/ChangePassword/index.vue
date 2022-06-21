<template>
  <ElDialog v-model="dialogVisible" width="460px" destroy-on-close append-to-body :show-close="false">
    <template #title>
      <span class="dialog-title">修改密码</span>
    </template>
    <div class="form-wrapper">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="right" @keyup.enter="submitForm('form')">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model.trim="form.oldPassword" class="lang-input" clearable show-password placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model.trim="form.newPassword" class="lang-input" clearable show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="newPasswordConfirm">
          <el-input v-model.trim="form.newPasswordConfirm" class="lang-input" clearable show-password placeholder="请确认新密码" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="changePasswordLoading" @click="submitForm">提交</el-button>
      </span>
    </template>
  </ElDialog>
</template>
<script setup>
  import { formValidateIsCodeNumberLine, formValidateIsStrongPassword } from '@/utils/patter';
  import { changePassword } from '@/api/modules/session';
  import { messageContentRender } from '@/utils/createdHtmlTemplate';
  import { useUserStore } from '@/store/user';
  import { desEncrypt } from '@/utils/jsencrypt';

  const userStore = useUserStore();
  const formValidateValueAs = (rule, value, callback) => {
    if (value !== form.value.newPassword) {
      callback(new Error('两次输入新密码不一致'));
    } else {
      callback();
    }
  };
  const rules = ref({
    oldPassword: [
      { required: true, message: '请输入旧密码', trigger: 'blur' },
      {
        validator: formValidateIsCodeNumberLine,
        trigger: 'blur'
      }
    ],
    newPassword: [
      { required: true, message: '请输入新密码', trigger: 'blur' },
      {
        validator: formValidateIsCodeNumberLine,
        trigger: 'blur'
      },
      {
        validator: formValidateIsStrongPassword,
        trigger: 'blur'
      }
    ],
    newPasswordConfirm: [
      { required: true, message: '请确认新密码', trigger: 'blur' },
      {
        validator: formValidateIsCodeNumberLine,
        trigger: 'blur'
      },
      {
        validator: formValidateValueAs,
        trigger: 'blur'
      },
      {
        validator: formValidateIsStrongPassword,
        trigger: 'blur'
      }
    ]
  });
  const form = ref({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  });
  const dialogVisible = ref(false);
  const changePasswordLoading = ref(false);
  function submitForm() {
    if (!form.value.oldPassword) {
      ElMessage.error('请输入旧密码');
      return;
    }
    if (!form.value.newPassword || !form.value.newPasswordConfirm) {
      ElMessage.error('请输入新密码');
      return;
    }
    if (form.value.newPassword !== form.value.newPasswordConfirm) {
      ElMessage.error('两次输入新密码不一致');
      return;
    }
    formRef.value.validate(async (valid) => {
      if (valid) {
        changePasswordLoading.value = true;
        const sendData = {
          oldPassword: (await desEncrypt(form.value.oldPassword)) || '',
          newPassword: (await desEncrypt(form.value.newPassword)) || '',
          newPasswordConfirm: (await desEncrypt(form.value.newPasswordConfirm)) || ''
        };
        changePassword(sendData)
          .then(() => {
            changePasswordLoading.value = false;
            ElMessageBox.confirm(
              messageContentRender({
                icon: 'el-icon-success success',
                title: '提示',
                message: '密码修改成功，需要重新登录本系统'
              }),
              {
                dangerouslyUseHTMLString: true,
                showConfirmButton: true,
                confirmButtonText: '知道了',
                showCancelButton: false,
                showClose: false
              }
            ).then(() => {
              closeDialog();
              changePasswordLoading.value = false;
              userStore.logout();
            });
          })
          .catch(() => {
            changePasswordLoading.value = false;
          });
      } else {
        return false;
      }
    });
  }
  function openDialog() {
    dialogVisible.value = true;
  }
  function closeDialog() {
    dialogVisible.value = false;
    resetForm();
  }
  const formRef = ref(null);
  function resetForm() {
    formRef.value.resetFields();
  }
  defineExpose({
    openDialog
  });
</script>
<style scoped lang="scss">
  .form-wrapper {
    width: 100%;
  }
</style>
