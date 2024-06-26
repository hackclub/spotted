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
          last_spot_image: members.where(user_id: spot.spotter_id).first.last_spot_image,
          picture: spot.spotter.picture.attached? ? Rails.application.routes.url_helpers.url_for(spot.spotter.picture) : spot.spotter.emoji,
          points: 0,
          id: members.where(user_id: spot.spotter_id).first.id
        }
      end
      puts leaderboard[spot.spotter_id]
      leaderboard[spot.spotter_id][:points] += spot.points
    end
    members.each do |member|
      unless leaderboard[member.user.id]
        leaderboard[member.user.id] = {
          name: member.user.name || member.user.email,
          last_spot_image: member.last_spot_image,
          picture: member.user.picture.attached? ? Rails.application.routes.url_helpers.url_for(member.user.picture) : member.user.emoji,
          points: 0,
          id: member.id
        }
      end
    end
    leaderboard.values.sort_by { |u| u[:points] }
  end
  
  def activity_log
    spots.order(created_at: :desc).map { |spot| spot.entry }
  end
  
  def spots_in_past_hour
    spots.where("spots.created_at > ?", 1.hour.ago).pluck(:spotter_id, :spotted_id)
  end
end

