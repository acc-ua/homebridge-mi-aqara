const DeviceParser = require('./DeviceParser');
const AccessoryParser = require('./AccessoryParser');
const SwitchVirtualBasePressParser = require('./SwitchVirtualBasePressParser');

class Button3Parser extends DeviceParser {
    constructor(platform) {
        super(platform);
    }
    
    getAccessoriesParserInfo() {
        return {
            'Button3_StatelessProgrammableSwitch': Button3StatelessProgrammableSwitchParser,
            'Button3_StatelessProgrammableSwitch_Shake': Button3StatelessProgrammableSwitchShakeParser,
            'Button3_Switch_VirtualSinglePress': Button3SwitchVirtualSinglePressParser,
            'Button3_Switch_VirtualDoublePress': Button3SwitchVirtualDoublePressParser,
            // 'Button_Switch_VirtualLongPress': Button3SwitchVirtualLongPressParser
            'Button3_Switch_VirtualShake': Button3SwitchVirtualShakeParser
        }
    }
}
Button3Parser.modelName = ['sensor_switch.aq3'];
module.exports = Button3Parser;

class Button3StatelessProgrammableSwitchParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.PROGRAMMABLE_SWITCH;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Button 3',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.StatelessProgrammableSwitch(accessoryName);
        service.getCharacteristic(that.Characteristic.ProgrammableSwitchEvent);
        result.push(service);
        
        var batteryService  = new that.Service.BatteryService(accessoryName);
        batteryService.getCharacteristic(that.Characteristic.StatusLowBattery);
        batteryService.getCharacteristic(that.Characteristic.BatteryLevel);
        batteryService.getCharacteristic(that.Characteristic.ChargingState);
        result.push(batteryService);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.StatelessProgrammableSwitch);
            var programmableSwitchEventCharacteristic = service.getCharacteristic(that.Characteristic.ProgrammableSwitchEvent);
            var value = that.getProgrammableSwitchEventCharacteristicValue(jsonObj, null);
            if(null != value) {
                programmableSwitchEventCharacteristic.updateValue(value);
            }
            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
    
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(jsonObj['sid']));
        if(1 == proto_version_prefix) {
            value = this.getValueFrJsonObjData1(jsonObj, 'status');
        } else if(2 == proto_version_prefix) {
            value = this.getValueFrJsonObjData2(jsonObj, 'button_0');
        } else {
        }
        
        if(value === 'click') {
            return this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        } else if(value === 'double_click') {
            return this.Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS;
        } else if(value === 'long_click_release') {
            /* 'long_click_press' */
            return this.Characteristic.ProgrammableSwitchEvent.LONG_PRESS;
        } else {
            return defaultValue;
        }
    }
}

class Button3StatelessProgrammableSwitchShakeParser extends AccessoryParser {
    constructor(platform, accessoryType) {
        super(platform, accessoryType)
    }
    
    getAccessoryCategory(deviceSid) {
        return this.Accessory.Categories.PROGRAMMABLE_SWITCH;
    }
    
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Button 3',
            'SerialNumber': deviceSid
        };
    }

    getServices(jsonObj, accessoryName) {
        var that = this;
        var result = [];
        
        var service = new that.Service.StatelessProgrammableSwitch(accessoryName);
        service.getCharacteristic(that.Characteristic.ProgrammableSwitchEvent);
        result.push(service);
        
        var batteryService  = new that.Service.BatteryService(accessoryName);
        batteryService.getCharacteristic(that.Characteristic.StatusLowBattery);
        batteryService.getCharacteristic(that.Characteristic.BatteryLevel);
        batteryService.getCharacteristic(that.Characteristic.ChargingState);
        result.push(batteryService);
        
        return result;
    }
    
    parserAccessories(jsonObj) {
        var that = this;
        var deviceSid = jsonObj['sid'];
        var uuid = that.getAccessoryUUID(deviceSid);
        var accessory = that.platform.AccessoryUtil.getByUUID(uuid);
        if(accessory) {
            var service = accessory.getService(that.Service.StatelessProgrammableSwitch);
            var programmableSwitchEventCharacteristic = service.getCharacteristic(that.Characteristic.ProgrammableSwitchEvent);
            programmableSwitchEventCharacteristic.setProps({
                validValues: [0]
            });
            var value = that.getProgrammableSwitchEventCharacteristicValue(jsonObj, null);
            if(null != value) {
                programmableSwitchEventCharacteristic.updateValue(value);
            }
            
            that.parserBatteryService(accessory, jsonObj);
        }
    }
    
    getProgrammableSwitchEventCharacteristicValue(jsonObj, defaultValue) {
        var value = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(jsonObj['sid']));
        if(1 == proto_version_prefix) {
            value = this.getValueFrJsonObjData1(jsonObj, 'status');
        } else if(2 == proto_version_prefix) {
            value = this.getValueFrJsonObjData2(jsonObj, 'button_0');
        } else {
        }
        
        if(value === 'shake') {
            return this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        } else {
            return defaultValue;
        }
    }
}

class Button3SwitchVirtualBasePressParser extends SwitchVirtualBasePressParser {
    getAccessoryInformation(deviceSid) {
        return {
            'Manufacturer': 'Aqara',
            'Model': 'Button 3',
            'SerialNumber': deviceSid
        };
    }
}

class Button3SwitchVirtualSinglePressParser extends Button3SwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"status":"click", "key": "${key}"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"button_0":"click"}], "key": "${key}"}';
        } else {
        }
        
        return command;
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(jsonObj['sid']));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"status":"click"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"button_0":"click"}]}';
        } else {
        }
        var newObj = JSON.parse(command);
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

class Button3SwitchVirtualDoublePressParser extends Button3SwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"status":"double_click", "key": "${key}"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"button_0":"double_click"}], "key": "${key}"}';
        } else {
        }
        
        return command;
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"status":"double_click"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"button_0":"double_click"}]}';
        } else {
        }
        var newObj = JSON.parse(command);
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}

// class Button3SwitchVirtualLongPressParser extends Button3SwitchVirtualBasePressParser {
    // getWriteCommand(deviceSid, value) {
        // var model = this.platform.getDeviceModelBySid(deviceSid);
        // var command = null;
        // var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        // if(1 == proto_version_prefix) {
            // command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"status":"long_click_press", "key": "${key}"}}';
        // } else if(2 == proto_version_prefix) {
            // command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"button_0":"long_click_press"}], "key": "${key}"}';
        // } else {
        // }

        // return command;
    // }
    
    // doSomething(jsonObj) {
        // var deviceSid = jsonObj['sid'];
        // var model = this.platform.getDeviceModelBySid(deviceSid);
        // var command = null;
        // var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        // if(1 == proto_version_prefix) {
            // command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"status":"long_click_press"}}"';
        // } else if(2 == proto_version_prefix) {
            // command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"button_0":"long_click_press"}]}"';
        // } else {
        // }
        // var newObj = JSON.parse(command);
        // this.platform.ParseUtil.parserAccessories(newObj);
    // }
// }

class Button3SwitchVirtualShakeParser extends Button3SwitchVirtualBasePressParser {
    getWriteCommand(deviceSid, value) {
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","data":{"status":"shake", "key": "${key}"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"write","model":"' + model + '","sid":"' + deviceSid + '","params":[{"button_0":"shake"}], "key": "${key}"}';
        } else {
        }
        
        return command;
    }
    
    doSomething(jsonObj) {
        var deviceSid = jsonObj['sid'];
        var model = this.platform.getDeviceModelBySid(deviceSid);
        var command = null;
        var proto_version_prefix = this.platform.getProtoVersionPrefixByProtoVersion(this.platform.getDeviceProtoVersionBySid(deviceSid));
        if(1 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "data":{"status":"shake"}}';
        } else if(2 == proto_version_prefix) {
            command = '{"cmd":"report","model":"' + model + '","sid":"' + deviceSid + '", "params":[{"button_0":"shake"}]}';
        } else {
        }
        var newObj = JSON.parse(command);
        this.platform.ParseUtil.parserAccessories(newObj);
    }
}
