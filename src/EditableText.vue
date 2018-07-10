<template>
  <input
    v-if="editing"
    ref="input"
    class="astnode editing"
    :style="{width: content_size+'ch'}"
    :class="{invalidInput: !this.is_valid}"
    :placeholder="placeholder"
    v-model="temp_content"
    @blur="editing=false"
    @keyup.enter.stop="sel_end"
    @keyup.escape.stop="sel_abort"
    @keyup.stop
    @keydown="log"
    @keydown.delete.stop
  ><span
  v-else
  ref="input2"
  class="astnode viewing"
  tabindex="-1"
  :class="{
        placeholder: this.content.length === 0,
        invalidInput: !this.is_valid,
      }"
  v-text="content_or_placeholder"
  @click.stop="$emit('focus')"
  @dblclick.stop="sel"
  @keyup.enter.stop="sel"
  @keyup.stop="$emit('keyup', $event)"
></span>
</template>

<script>
  export default {
    name: "EditableText",
    props: {
      content: String,
      placeholder: String,
      keyFilter: Function,
      validation: Function,
      getParentCommands: Function,
    },
    data: function () {
      return {
        editing: false,
        temp_content: "",
      }
    },
    methods: {
      focus: function() {
        this.$refs.input2.focus();
      },
      sel: function() {
        this.editing = true;
        this.temp_content = this.content;
        this.$nextTick(function () {
          this.$refs.input.select();
        });
      },
      sel_end: function() {
        if (!this.is_valid){
          return
        }
        this.editing = false;
        this.$emit('update:content', this.temp_content);
        this.$nextTick(function () {
          this.$emit('focus');
        });
      },
      sel_abort: function() {
        this.editing = false;
        this.$nextTick(function () {
          this.$emit('focus');
        });
      },
      get_commands: function () {
        if (this.editing){
          return [];
        }else{
          return this.getParentCommands();
        }
      },
      log: function (evt) {
        console.log(evt);
      }
    },
    computed: {
      content_size: function () {
        let clen = this.temp_content.length;
        return clen > 0 ? clen : this.placeholder.length;
      },
      content_or_placeholder: function () {
        return this.content.length? this.content: this.placeholder;
      },
      is_valid: function () {
        if (!this.validation){
          return true;
        }else{
          return this.validation(this.editing?this.temp_content:this.content);
        }
      }
    }
  }
</script>

<style scoped>
  .editing {
    outline: 1px solid black;
  }

  .viewing {
    user-select: none;
    -moz-user-select: none;
  }

  .placeholder {
    color: gray;
  }

  .invalidInput {
    background-color: lightpink;
  }

</style>
