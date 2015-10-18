#!/usr/bin/ruby

require 'json'
require 'fileutils'
require 'digest'

config = [
    {
        :source => "../tsog-alphabet/res/HD/",
        :dest => "public/games/alphabet/HD/",
        :uri => "games/alphabet/HD/",
        :folders => [
            "animals",
            "things",
            "../sounds",
            "../sounds/animals",
            "../sounds/things",
            "../config"
        ],
        :searchPaths => [
            "res/HD"
        ]
    },
    {
        :source => "../tsog-alphabet/res/SD/",
        :dest => "public/games/alphabet/SD/",
        :uri => "games/alphabet/SD/",
        :folders => [
            "animals",
            "things",
            "../sounds",
            "../sounds/animals",
            "../sounds/things",
            "../config"
        ],
        :searchPaths => [
            "res/SD"
        ]
    }
]

version = ARGV[0] || "1.0.0"
host = ARGV[1] || "http://localhost:3000"

config.each do |c|
    projectData = {
        :packageUrl => host + "/" + c[:uri],
        :remoteVersionUrl => host + "/" + c[:uri] + "version.manifest",
        :remoteManifestUrl => host + "/" + c[:uri] + "project.manifest",
        :version => version,
        :engineVersion => "cocos2d-x-3.7.1"
    }
    FileUtils.mkdir_p c[:dest] unless File.exists? c[:dest]
    File.open(c[:dest] + "version.manifest","w") do |f|
        f.write(projectData.to_json)
    end

    assets = {}
    c[:folders].each do |folder|
        files = Dir[c[:source] + folder + "/*"]
        files.each do |f|
            next if File.directory?(f)

            md5Hash = Digest::MD5.hexdigest File.read f
            fileName = f.gsub(c[:source], "").gsub("../", "")

            assets[fileName] = {
                    md5: md5Hash
                }
        end
        destPath = c[:dest] + folder.gsub("../", "")
        FileUtils.mkdir_p destPath unless File.exists? destPath
        FileUtils.cp_r (c[:source] + folder + "/."), destPath
    end

    projectData[:assets] = assets
    projectData[:searchPaths] = c[:searchPaths]

    File.open(c[:dest] + "project.manifest","w") do |f|
        # f.write(JSON.pretty_generate(projectData));
        f.write(projectData.to_json)
    end
end
