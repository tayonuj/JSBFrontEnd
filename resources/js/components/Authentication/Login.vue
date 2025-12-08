<template>
    <div>
      <video-background
          src="/img/dockyard.mp4"
          poster="/img/port_yard_cover.jpg"
          style="height: 150vh;margin-top: -150px"

      >
        <div class="row">
          <div class="col-6 d-none d-lg-block position-relative">
            <!--/.bg-holder-->
          </div>
          <div class="row flex-center min-vh-100 py-6 mt-6">
            <div class="col-sm-10 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
              <div class="d-flex flex-center mb-1">
                <img class="me-2" src="/assets/img/slpa_logo.png" alt="" width="58" />
                <h1  style="color:#02adef;font-weight: bolder">HR<span style="color: #f2b00f">IS</span></h1>
              </div>

              <div class="card bg-transparent-50">
                <CardBody class="card-body p-sm-5">
                  <div class="row flex-between-center mb-2">
                    <div class="col-auto">
                      <h5>Sign in</h5>
                    </div>
                  </div>
                  <form v-on:submit.prevent>
                    <div class="mb-3">
                      <input class="form-control" type="email" placeholder="hrxxxxxxxx" v-model="email" />
                    </div>
                    <div class="mb-3">
                      <input class="form-control" type="password" placeholder="Password" v-model="pw" />
                    </div>
                    <!--                  <div class="row flex-between-center">-->
                    <!--                    <div class="col-auto">-->
                    <!--                      <div class="form-check mb-0">-->
                    <!--                        <input class="form-check-input" type="checkbox" id="basic-checkbox" checked="checked" />-->
                    <!--                        <label class="form-check-label mb-0" for="basic-checkbox">Remember me</label>-->
                    <!--                      </div>-->
                    <!--                    </div>-->
                    <!--                  </div>-->
                    <div class="mb-3">
                      <button class="btn btn-primary d-block w-100 mt-3" type="submit" name="submit" @click="signIn()" >Log in</button>
                    </div>
                  </form>
                </CardBody>
              </div>
            </div>
          </div>



        </div>

      </video-background>
<!--      <video-background-->
<!--          src="/img/dockyard.mp4"-->
<!--          style="max-height: 400px; height: 100vh;"-->
<!--      >-->
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import NotificationHandling from "../../composables/application/notificationHandling";
import generalAxiosRequest from "../../composables/application/generalAxiosRequest";
import Card from "../bootstrap/Card.vue";
import CardHeader from "../bootstrap/CardHeader.vue";
import CardBody from "../bootstrap/CardBody.vue";

const email = ref('');
const pw = ref('');
const loading = ref(false);
const signIn = async () => {
    loading.value = true;
    const payload = {
            url: 'https://slpahris.g-sentry.com/api/v1/auth/login',
            data: JSON.stringify({
              username: email.value,
              password: pw.value
            })
        }
        try {

            // const {json_data} = await generalAxiosRequest('curl-requests/post', payload, false);
            // console.log("Loging data",json_data.value)

            // if(!json_data.value || json_data.value.message === 'Invalid credentials.'){
            //     NotificationHandling("error","Invalid Credentials");

            // }else{
            //     localStorage.setItem('user',JSON.stringify(json_data.value));
            //     NotificationHandling("success","Redirecting to Homepage...");
            //       location.href = "/employee";

            // }

            const user = {
            full_name:"temp",
            url: 'https://slpahris.g-sentry.com/api/v1/auth/login',
            data: JSON.stringify({
              username: email.value,
              password: pw.value
            })
        }
           if(email.value == "temp" && pw.value =="123" ){
                  localStorage.setItem('user',JSON.stringify(user));
                NotificationHandling("success","Redirecting to Homepage...");
                  location.href = "/";

            }
        } catch (error) {
            console.log("Loging data error",error)
            NotificationHandling("error", "An error occurred during login");
        } finally {
            loading.value = false;
        }



//   if (email.value === "rasikak73@gmail.com" && pw.value === "1234"){
//       let user = {email:email.value, password:pw.value}
//       localStorage.setItem("user",JSON.stringify(user));
//       NotificationHandling("success","Redirecting to Homepage...");
//       location.href = "/";
//       loading.value = false;
//   }else{
//       NotificationHandling("error","Invalid Credentials");
//       loading.value = false;
//   }
}
onMounted(() => {
    if (localStorage.getItem('reloaded')) {
        // The page was just reloaded. Clear the value from local storage
        // so that it will reload the next time this page is visited.
        localStorage.removeItem('reloaded');
    } else {
        // Set a flag so that we know not to reload the page twice.
        localStorage.setItem('reloaded', '1');
        location.reload();
    }
})
</script>

<style scoped>
.transparent-card .card-body {
  background-color: rgba(0, 0, 0, 0.1); /* Semi-transparent background */
  color: white; /* Text color for readability */
  border-radius: 15px; /* Optional: Rounded corners */
}

.card-body input {
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent input fields */
  color: black; /* Input text color */
}

.card-body input::placeholder {
  color: rgba(0, 0, 0, 0.6); /* Placeholder text color */
}

.card-body button {
  background-color: #02adef; /* Button color */
  border: none;
}

.card-body button:hover {
  background-color: #0198d1; /* Button hover color */
}

</style>
