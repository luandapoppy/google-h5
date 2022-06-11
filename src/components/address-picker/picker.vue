<template>
  <van-picker show-toolbar :columns="areaOptions" value-key="name" @confirm="confirmClick" @cancel="cancelClick" />
</template>

<script>
import areaOptions from "@/config/address.js";
export default {
  data() {
    return {
      areaOptions: areaOptions
    }
  },
  methods: {
    confirmClick(e, f) {
      const province = areaOptions[f[0]];
      const city = province.children[f[1]];
      const country = city.children[f[2]];
      let addressIdText = e.join('');
      let addressId = province.id + ',' + city.id + ',' + country.id;
      this.$emit("onAddressIdConfirm", e, addressId)
    },
    cancelClick() {
      this.$emit("onAddressIdCancel")
    }
  }
}
</script>

<style>

</style>