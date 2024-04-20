# frozen_string_literal: true

class Team < ApplicationRecord
  belongs_to :creator, class_name: "User"

  validates :creator, :name, presence: true
  
  has_many :members
  
  has_one_attached :logo
  has_many :members
  has_many :spots, through: :members

  def leaderboard
    leaderboard = {}
    spots.where("spots.created_at > ?", 7.days.ago).each do |spot|
      unless leaderboard[spot.spotter_id]
        leaderboard[spot.spotter_id] = {
          name: spot.spotter.name || spot.spotter.email,
          picture: spot.spotter.picture.attached? ? Rails.application.routes.url_helpers.url_for(spot.spotter.picture) : spot.spotter.emoji,
          points: 0
        }
      end
      puts leaderboard[spot.spotter_id]
      leaderboard[spot.spotter_id][:points] += spot.points
    end
    members.each do |member|
      unless leaderboard[member.user.id]
        leaderboard[member.user.id] = {
          name: member.user.name || member.user.email,
          picture: member.user.picture.attached? ? Rails.application.routes.url_helpers.url_for(member.user.picture) : member.user.emoji,
          points: 0
        }
      end
    end
    leaderboard.values.sort_by { |u| u[:points] }
  end
  
  def activity_log
    spots.map { |spot| spot.entry }
  end
end

