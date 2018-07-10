<template>
    <EditableText ref="elmt"
      :content.sync="data.id"
      :placeholder="'<name>'"
      :validation="validate"
      :getParentCommands="get_own_commands"
      @focus="focus"
      @keyup="onKey"
    ></EditableText>
</template>

<script>
  import nodeBase from "./nodeBase";
  import EditableText from "./EditableText";

  export default {
    name: "Name",
    mixins: [nodeBase],
    components: {EditableText},
    methods: {
      get_children: function () {
        return [];
      },
      get_commands: function () {
        return this.$refs.elmt.get_commands();
      },
      get_own_commands: function() {
        return this.get_base_commands().concat([
          ["Enter", "Edit", function () {}, function () {return true;}],
        ])
      },
      validate: function (s) {
        let reserved_names = [
          "False", "class", "finally", "is", "return", "None", "continue", "for", "lambda", "try", "True", "def",
          "from", "nonlocal", "while", "and", "del", "global", "not", "with", "as", "elif", "if", "or", "yield",
          "assert", "else", "import", "pass", "break", "except", "in", "raise",
        ];
        return s.match(/^[a-z_][a-z0-9_]*$/i) && reserved_names.indexOf(s)<0;
      },

    }
  }
</script>

<style scoped>

</style>
