<template>
  <div class="table-responsive">
    <table class="table table-sm table-striped fs-10 mb-0">
      <thead class="bg-200">
      <tr>
        <th v-for="(header, index) in headers" :key="index" class="text-900 sort pe-1 align-middle">
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex">
        <td v-for="(value, colIndex) in row" :key="colIndex" class="align-middle">
          {{ value }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: {
    headers: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}
</style>
