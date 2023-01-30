function connectWS(ws)
    while true do
        soc, err = http.websocket(ws, {"turtle"})
        if not soc then print("Connection Failed: Retrying...") else break end
        os.sleep(1)
    end

    return soc
end

function doesStuff(soc)
    
end


function main()
    local ws = "ws://47.224.180.33:5656"
    soc = connectWS(ws)
    local messageQueue = {}
    while true do
        local response = soc.receive()
        if not response then
            main()
        end
        response = textutils.unserialiseJSON(response)
        table.insert(messageQueue, response.message)
        while #messageQueue > 0 do
            local message = table.remove(messageQueue, 1)
            local r, err = load("local function myFunc() return " .. message .. " end; return myFunc")
            if r ~= nil then
                local success, result = pcall(r)
                if not success then
                    print("Error: " .. result)
                    soc.send(textutils.serialiseJSON({type="turtle", turtle=result, id=response.id}))
                else
                    local success, finalResult = pcall(result)
                    if not success then
                        print("Error: " .. finalResult)
                        soc.send(textutils.serialiseJSON({type="turtle", turtle=tostring(finalResult), id=response.id}))
                    else
                        print(finalResult)
                        soc.send(textutils.serialiseJSON({type="turtle", turtle=tostring(finalResult), id=response.id}))
                    end
                end
            else
                print(err)
            end 
        end
    end
end

main()