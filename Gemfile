source "https://rubygems.org"

gem "jekyll", "~> 4.3.2"
gem "webrick", "~> 1.8"  # Required for Ruby 3.0+

# Jekyll plugins
group :jekyll_plugins do
  gem "jekyll-paginate-v2"
  gem "jekyll-sitemap"
end

# Windows and JRuby support
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance monitoring
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]