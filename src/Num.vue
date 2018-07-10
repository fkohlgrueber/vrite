<template>
    <EditableText ref="elmt"
      :content.sync="data.n"
      :placeholder="'<num>'"
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
    name: "Num",
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
        let digit = "[0-9]";
        let nonzerodigit = "[1-9]";
        let bindigit = "[0-1]";
        let octdigit = "[0-7]";
        let hexdigit = "(" + digit + "|" + "[a-fA-F])";
        let decInteger = "(" + nonzerodigit + "(_?" + digit + ")*"+ "|" + "0(_?0)*" + ")";
        let binInteger = "0b(_?" + bindigit + ")+";
        let octInteger = "0o(_?" + octdigit + ")+";
        let hexInteger = "0x(_?" + hexdigit + ")+";
        let integer = "(" + decInteger + "|" + binInteger + "|" + octInteger + "|" + hexInteger + ")";

        let digitPart = digit + "(_?" + digit + ")*";
        let fraction = "\\."+digitPart;
        let exponent = "e[\\+-]?" + digitPart;
        let pointFloat = "((" + digitPart + ")?" + fraction + "|" + digitPart + "\\.)";
        let exponentFloat = "(" + digitPart + "|" + pointFloat + ")" + exponent;
        let floatNumber = "(" + pointFloat + "|" + exponentFloat + ")";

        let imagnumber = "(" + floatNumber + "|" + digitPart + ")j";
        let number = "(" + integer + "|" + floatNumber + "|" + imagnumber + ")";
        return  s.match(new RegExp("^" + number + "$"));
      },

    }
  }
</script>

<style scoped>

</style>
