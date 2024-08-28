<template>
    <div class="alert-box">
        <strong class="title">This is an error for demo purposes</strong>
        <slot></slot>
    </div>
</template>
<style scoped>
.alert-box {
    border: 1px solid #ed3c50;
    border-radius: 8px;
    background-color: #f9f9f9;
    padding: 20px;
    font-size: 14px;
    line-height: 1.6;
    font-weight: 500;
    color: #0000008c;
}
.title {
    color: #ed3c50;
    margin-bottom: 8px;
    font-size: 15px;
    display: block;
    font-weight: 600;
}
</style>