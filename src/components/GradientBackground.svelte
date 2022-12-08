<div class="login-background">
    <slot></slot>
</div>

<style>

    .login-background {

        width: 100%;
        height: 100%;

        background: linear-gradient(to right, #43c6ac, #f8ffae);
        background-size: 600% 600%;

        -webkit-animation: AnimatedBackground 19s ease infinite;
        -moz-animation: AnimatedBackground 19s ease infinite;
        animation: AnimatedBackground 19s ease infinite;
    }

    @-webkit-keyframes AnimatedBackground {
        0%{background-position:11% 0%}
        50%{background-position:90% 100%}
        100%{background-position:11% 0%}
    }
    @-moz-keyframes AnimatedBackground {
        0%{background-position:11% 0%}
        50%{background-position:90% 100%}
        100%{background-position:11% 0%}
    }
    @keyframes AnimatedBackground {
        0%{background-position:11% 0%}
        50%{background-position:90% 100%}
        100%{background-position:11% 0%}
    }
</style>