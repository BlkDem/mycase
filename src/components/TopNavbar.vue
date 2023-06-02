<template>
  <!-- <v-card
    class="mx-auto"
    max-width="448"
  > -->
    <v-layout>
      <v-app-bar
        color="primary"

      >
    <v-menu activator="#menu-activator" >
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :value="index"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

      <template v-slot:prepend >
          <v-app-bar-nav-icon  id="menu-activator"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Photos</v-app-bar-title>

        <template v-slot:append>
          <v-btn icon="mdi-dots-vertical"></v-btn>
        </template>



      </v-app-bar>

      <v-main>
        <v-container fluid>
          <v-row dense>
            <v-col
              v-for="n in 8"
              :key="n"
              cols="3"
            >
              <v-sheet
                color="grey-lighten-2"
                height="96"
              ></v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-main>


      <v-bottom-navigation>
  <v-btn value="recent">
    <v-icon>mdi-history</v-icon>

    Recent
  </v-btn>

  <v-btn value="favorites">
    <v-icon>mdi-heart</v-icon>

    Favorites
  </v-btn>

  <v-btn value="nearby">
    <v-icon>mdi-map-marker</v-icon>

    Nearby
  </v-btn>
</v-bottom-navigation>
    </v-layout>
  <!-- </v-card> -->
</template>

<script>
  export default {
    data: () => ({
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
    }),
  }
</script>
