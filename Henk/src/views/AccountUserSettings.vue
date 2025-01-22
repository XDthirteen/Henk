<script setup lang="ts">
import EditIcon from '@/components/EditIcon.vue';

</script>

<template>

  <body>
    <div class="user-overview">
      <img class="user-image" src="../assets/images/cool_duck.png" alt="">
      <div class="user-info">
        <div class="user-fullname">First name + Last name</div>
        <div>My userID: ...</div>
        <div>*optional info*</div>
        <div>*optional info*</div>
      </div>
    </div>
    <div class="input-title">Last name: </div>
    <div class="field-container-wrapper">
      <div class="field-container">
        <div class="text-field">lastname</div>
        <EditIcon></EditIcon> <!--Voorlopig zit hier een @click die HelloWorld zal printen in console-->
      </div>
      <div class="field-container">
        <div class="text-field">lastname</div>
        <EditIcon></EditIcon> <!--Voorlopig zit hier een @click die HelloWorld zal printen in console-->
      </div>
      <div class="field-container">
        <div class="text-field">lastname</div>
        <EditIcon></EditIcon> <!--Voorlopig zit hier een @click die HelloWorld zal printen in console-->
      </div>
      <div class="field-container">
        <div class="text-field">lastname</div>
        <EditIcon></EditIcon> <!--Voorlopig zit hier een @click die HelloWorld zal printen in console-->
      </div>
      <div class="field-container">
        <div class="text-field">lastname</div>
        <EditIcon></EditIcon> <!--Voorlopig zit hier een @click die HelloWorld zal printen in console-->
      </div>
    </div>

  </body>
</template>

<style scoped>
body {
  margin: 1rem 2rem 1rem 2rem;
}

.user-overview {
  display: flex;
  border: 2px solid var(--primary-purple);
  border-radius: 10px;
  background-color: var(--tertiary-purple);
  padding: 0.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.user-image {
  border-radius: 100%;
  width: 20%;
  margin: 2rem 2rem 2rem 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
}

.user-fullname {
  text-decoration: underline;
  padding-bottom: 1rem;
}

.input-title {
  margin-bottom: 0.25rem;
}

.field-container-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.text-field {
  display: flex;
  border: 1px solid var(--secundary-purple);
  border-radius: 5px;
  width: 80%;
  align-items: center;
  padding-left: 1rem;

}
</style>
