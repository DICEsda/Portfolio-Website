    #include <linux/gpio.h>
    #include <linux/fs.h>
    #include <linux/cdev.h>
    #include <linux/device.h>
    #include <linux/uaccess.h>
    #include <linux/module.h>
    #include <linux/of.h>
    #include <linux/platform_device.h>
    #include <linux/delay.h>
    #include <linux/of_gpio.h>

    #define MAX_DEVICES 5

    static int servo_gpio;
    static int stepper_gpio_base;

    static dev_t devno;
    static struct class *gpio_class;
    static struct cdev gpio_cdev[MAX_DEVICES];

    static int servo_angle = 0;

    static const int step_sequence[4][4] = {
        {1, 0, 0, 1}, 
        {1, 1, 0, 0}, 
        {0, 1, 1, 0}, 
        {0, 0, 1, 1}
    };

    static ssize_t gpio_write(struct file *filep, const char __user *ubuf, size_t count, loff_t *f_pos) {
        char kbuf[32];
        char *temp_kbuf, *cmd, *steps_str;
        int minor = MINOR(filep->f_inode->i_rdev);
        int value;

        if (copy_from_user(kbuf, ubuf, min(count, sizeof(kbuf) - 1))) {
            return -EFAULT;
        }
        kbuf[count] = '\0';
        temp_kbuf = kbuf;

        if (minor == 0) { 
            if (kstrtoint(kbuf, 10, &value)) {
                pr_err("Invalid servo angle\n");
                return -EINVAL;
            }
            if (value < 0 || value > 180) {
                pr_err("Servo angle out of range (0-180)\n");
                return -EINVAL;
            }

            int duty_cycle = 500 + (value * 2000) / 180;
            gpio_set_value(servo_gpio, 1);
            udelay(duty_cycle);
            gpio_set_value(servo_gpio, 0);
            udelay(20000 - duty_cycle);
        } else if (minor == 1) { 
            cmd = strsep(&temp_kbuf, " ");
            steps_str = strsep(&temp_kbuf, " ");
            int steps, clockwise;

            if (!cmd || !steps_str || kstrtoint(steps_str, 10, &steps)) {
                pr_err("Invalid stepper command\n");
                return -EINVAL;
            }
            clockwise = strcmp(cmd, "forward") == 0;

            for (int i = 0; i < steps; i++) {
                int idx = clockwise ? i % 4 : (3 - (i % 4));
                for (int j = 0; j < 4; j++) {
                    gpio_set_value(stepper_gpio_base + j, step_sequence[idx][j]);
                }
                msleep(2);
            }
            for (int i = 0; i < 4; i++) {
                gpio_set_value(stepper_gpio_base + i, 0);
            }
        }

        return count;
    }

    static ssize_t gpio_read(struct file *filep, char __user *buf, size_t count, loff_t *f_pos) {
        char kbuf[32];
        int len, minor = MINOR(filep->f_inode->i_rdev);

        if (minor == 0) {
            len = snprintf(kbuf, sizeof(kbuf), "Servo angle: %d\n", servo_angle);
        } else if (minor == 1) {
            len = snprintf(kbuf, sizeof(kbuf), "Stepper motor ready\n");
        } else {
            return -EINVAL;
        }

        if (copy_to_user(buf, kbuf, len)) {
            return -EFAULT;
        }

        return len;
    }
        
    static const struct file_operations gpio_fops = {
        .owner = THIS_MODULE,
        .write = gpio_write,
        .read = gpio_read,
    };

    // Probe function
    static int plat_drv_probe(struct platform_device *pdev) {
        dev_t curr_devno;
        int err;

        servo_gpio = of_get_named_gpio(pdev->dev.of_node, "servo-gpio", 0);
        if (!gpio_is_valid(servo_gpio)) {
            pr_err("Invalid servo GPIO\n");
            return -EINVAL;
        }

        stepper_gpio_base = of_get_named_gpio(pdev->dev.of_node, "stepper-gpio-base", 0);
        if (!gpio_is_valid(stepper_gpio_base)) {
            pr_err("Invalid stepper GPIO base\n");
            return -EINVAL;
        }

        pr_info("Probing GPIO Driver\n");

        // Allocate character devices
        err = alloc_chrdev_region(&devno, 0, MAX_DEVICES, "plat_drv");
        if (err) {
            pr_err("Failed to allocate chrdev region\n");
            return err;
        }

        gpio_class = class_create(THIS_MODULE, "plat_drv_class");
        if (IS_ERR(gpio_class)) {
            unregister_chrdev_region(devno, MAX_DEVICES);
            return PTR_ERR(gpio_class);
        }

        // Create /dev/plat_drv0 for servo motor
        curr_devno = MKDEV(MAJOR(devno), 0);
        cdev_init(&gpio_cdev[0], &gpio_fops);
        cdev_add(&gpio_cdev[0], curr_devno, 1);
        device_create(gpio_class, NULL, curr_devno, NULL, "plat_drv0");

        // Create /dev/plat_drv1 for stepper pin 1
        curr_devno = MKDEV(MAJOR(devno), 1);
        cdev_init(&gpio_cdev[1], &gpio_fops);
        cdev_add(&gpio_cdev[1], curr_devno, 1);
        device_create(gpio_class, NULL, curr_devno, NULL, "plat_drv1");

        // Create /dev/plat_drv2 for stepper pin 2
        curr_devno = MKDEV(MAJOR(devno), 2);
        cdev_init(&gpio_cdev[2], &gpio_fops);
        cdev_add(&gpio_cdev[2], curr_devno, 1);
        device_create(gpio_class, NULL, curr_devno, NULL, "plat_drv2");

        // Create /dev/plat_drv3 for stepper pin 3
        curr_devno = MKDEV(MAJOR(devno), 3);
        cdev_init(&gpio_cdev[3], &gpio_fops);
        cdev_add(&gpio_cdev[3], curr_devno, 1);
        device_create(gpio_class, NULL, curr_devno, NULL, "plat_drv3");

        // Create /dev/plat_drv4 for stepper pin 4
        curr_devno = MKDEV(MAJOR(devno), 4);
        cdev_init(&gpio_cdev[4], &gpio_fops);
        cdev_add(&gpio_cdev[4], curr_devno, 1);
        device_create(gpio_class, NULL, curr_devno, NULL, "plat_drv4");

        // Request GPIOs for servo motor
        err = gpio_request_one(SERVO_GPIO, GPIOF_OUT_INIT_LOW, "Servo GPIO");
        if (err) {
            pr_err("Failed to request Servo GPIO\n");
            goto cleanup_servo;
        }

        // Request GPIOs for stepper motor pins
        err = gpio_request_one(STEPPER_GPIO_BASE + 0, GPIOF_OUT_INIT_LOW, "Stepper GPIO 1");
        if (err) {
            pr_err("Failed to request Stepper GPIO 1\n");
            goto cleanup_stepper1;
        }

        err = gpio_request_one(STEPPER_GPIO_BASE + 1, GPIOF_OUT_INIT_LOW, "Stepper GPIO 2");
        if (err) {
            pr_err("Failed to request Stepper GPIO 2\n");
            goto cleanup_stepper2;
        }

        err = gpio_request_one(STEPPER_GPIO_BASE + 2, GPIOF_OUT_INIT_LOW, "Stepper GPIO 3");
        if (err) {
            pr_err("Failed to request Stepper GPIO 3\n");
            goto cleanup_stepper3;
        }

        err = gpio_request_one(STEPPER_GPIO_BASE + 3, GPIOF_OUT_INIT_LOW, "Stepper GPIO 4");
        if (err) {
            pr_err("Failed to request Stepper GPIO 4\n");
            goto cleanup_stepper4;
        }

        pr_info("GPIO Driver successfully probed\n");
        return 0;

    // Cleanup in case of errors
    cleanup_stepper4:
        gpio_free(STEPPER_GPIO_BASE + 2);
    cleanup_stepper3:
        gpio_free(STEPPER_GPIO_BASE + 1);
    cleanup_stepper2:
        gpio_free(STEPPER_GPIO_BASE + 0);
    cleanup_stepper1:
        gpio_free(SERVO_GPIO);
    cleanup_servo:
        for (int i = 0; i <= 4; i++) {
            device_destroy(gpio_class, MKDEV(MAJOR(devno), i));
            cdev_del(&gpio_cdev[i]);
        }
        class_destroy(gpio_class);
        unregister_chrdev_region(devno, MAX_DEVICES);
        return err;
    }

    static int plat_drv_remove(struct platform_device *pdev) {
        pr_info("Removing GPIO Driver\n");

        // Destroy devices and free GPIOs
        for (int i = 0; i < MAX_DEVICES; i++) {
            device_destroy(gpio_class, MKDEV(MAJOR(devno), i));
            cdev_del(&gpio_cdev[i]);
        }
        class_destroy(gpio_class);
        unregister_chrdev_region(devno, MAX_DEVICES);

        gpio_free(SERVO_GPIO);
        for (int i = 0; i < 4; i++) {
            gpio_free(STEPPER_GPIO_BASE + i);
        }

        return 0;
    }

    static struct platform_driver plat_drv_driver = {
        .probe = plat_drv_probe,
        .remove = plat_drv_remove,
        .driver = {
            .name = "plat_drv",
        },
    };

    module_platform_driver(plat_drv_driver);
    MODULE_LICENSE("GPL");
    MODULE_AUTHOR("Yahya :)");
    MODULE_DESCRIPTION("GPIO Driver for Servo and Stepper Motor Control");
