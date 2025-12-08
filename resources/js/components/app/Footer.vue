<script>
export default {
	data() {
		return {
			year: (new Date()).getFullYear()
		}
	}
}
</script>
<template>
	<!-- BEGIN #footer -->
  <footer class="footer">
    <div class="row g-0 justify-content-between fs--1 mt-4 mb-3">
      <div class="col-12 col-sm-auto text-center">
        <p class="mb-0 text-600">Thank you for creating with IS <span class="d-none d-sm-inline-block">| </span><br class="d-sm-none" /> {{year}}} &copy; </p>
      </div>
      <div class="col-12 col-sm-auto text-center">
        <p class="mb-0 text-600">v1.0.0</p>
      </div>
    </div>
  </footer>
	<!-- END #footer -->
</template>
